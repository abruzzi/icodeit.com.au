---
title: "React Clean Code -  mocking network scenarios"
date: 2022-12-21T15:17:49+11:00
description: "Handling network requests is complicated. There are too many cases you have to consider on top of the asynchronised process. And testing these code can be even more challenging..."
cover: "/posts/images/react-clean-code-network-mocking/statechart.png"
---

In my book [Maintainable React](https://leanpub.com/maintainable-react), I introduced a feature I had worked on a while ago. That feature is interesting in many ways, and I selected it as it involves several states in the view - which is one of the reasons ***why building UI is complicated***.

They are not typical UI states but server cache as described in [Kent’s article here](https://kentcdodds.com/blog/application-state-management-with-react#server-cache-vs-ui-state). All the network requests could go wrong, timeout, too many requests or even service downtime. In the React views, we need to reflect these network statuses correspondingly.

[https://www.youtube.com/watch?v=GacOp9SPHaA](https://www.youtube.com/watch?v=GacOp9SPHaA)

### Different status

The feature **Direct to boot** here is that at the beginning, when the user is landed on the page, we need to check the current status of an order. If it’s in progress, we need to show a disabled button `I'm here` and some hint messages. And at some point, when the order is ready to pick up, the button needs to be enabled so we can click it to notify the store. When the button is clicked, a notification is sent and the order will be delivered right into the boot of your vehicle. In addition, if anything goes wrong, we show a number as a fallback so we can call the store by phone.

![Direct to boot](/posts/images/react-clean-code-network-mocking/direct-to-boot.png)

So we need to consider the following things at least:

- Fetch data from the server
- Retry if something goes wrong in the network
- Retry if the data is returned but not what we wanted
- Stop retrying when we fail too many times
- Update data to the server
- Handling errors

If we draw a `statechart` for the description above, it will be something like the diagram below. Note that the happy path (idle → ready → notified) is only **one of** the branches. Before the order is `ready`, we need to retry several times. And the notification might have another retry counter (we’re not doing it in this chart). Also, each network request could lead to an error.

![Statechart](/posts/images/react-clean-code-network-mocking/statechart.png)

### The happy path

We can start with the happy path as that’s the most easier step and the most important thing we want to ensure to happen.

In test, the happy path for (initialised → ready) can be described as:

```tsx
it("enables button when the order is ready", async () => {
    render(<DirectToBoot orderId="order-id"/>);

    expect(
        screen.getByText("We are preparing your order...")
    ).toBeInTheDocument();

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    await waitFor(() => expect(button).toBeEnabled(), {timeout: 3000});
    await screen.findByText("Please click the button when you have arrived...");
});
```

### Mirage.js for mocking

In my book I used `msw` as the mocking server, and it worked pretty well. I’m using `mirage.js` here just for simplicity. It doesn’t matter much here anyway, and you [are safe to use either one](https://miragejs.com/docs/comparison-with-other-tools/).

For example, we can define a `get` API for checking the order status in the test. It intercepts requests send to `/api/orders/<id>` and always returns an object with `ready` status. 

```tsx
import { createServer } from "miragejs";

const createMockServer = () => createServer({
  routes() {
    this.get("/api/orders/:id", (schema, request) => {
      return {
        id: request.params.id,
        status: "ready",
      };
    });
  }
})
```

And then, we create a server at the beginning of each test, and shut it down at the end.

```tsx
describe("Direct To Boot", () => {
  beforeEach(() => {
    server = createMockServer();
  })

  afterEach(() => {
    server.shutdown()
  })

  //...
});
```

The API looks intuitive and works just as expected. We can then in our component to send requests and consume the response like it would for the actual APIs.

### Use react-query to simplify the logic

In [my previous article](https://itnext.io/the-pragmatic-guide-to-react-network-programming-c6f9de9962ed), I have discussed in detail how many trivial things you need to consider for making a “simple” network request as well as how simpler if you use `react-query` instead of implementing it manually.

To use `react-query` we’ll need to define a `query` function. Note here if the `res.data.status` is not `ready`, it will throw an error. And `react-query` can detect that error and trigger a `refetch` if configured.

```tsx
const fetchOrder = (orderId: string) => {
  return axios.get(`/api/orders/${orderId}`).then((res) => {
    if (res.data.status === "ready") {
      return res.data;
    } else {
      throw new Error("fetch error");
    }
  });
};
```

Now with the `fetchQuery` function, I can then call `useQuery`, and wrap the whole logic inside a hook `useOrder`

```tsx
const useOrder = (orderId: string) => {
  const [status, setStatus] = useState<string>("initialised");

  useQuery(["fetchOrder"], () => fetchOrder(orderId), {
    retry: 5,
    onError: () => setStatus("error"),
    onSuccess: () => setStatus("ready"),
  });

  return { status }
}
```

I set retry as 5, so whenever an actual error happens (say, 500 from the server side) or when `res.data.status` is not `ready`, `react-query` will retry. And [it doesn’t retry right away](https://tanstack.com/query/v4/docs/react/guides/query-retries#retry-delay) but wait for a little while as a delay between each failure.

### Simulate an error

In `mirage.js`, simulating an error for the test to catch is fairly straightforward. I also found it might be helpful to have several `id`s that would trigger errors so you can test different error-handling logic.

For example, we can define a list of `id`s that indicate errors when used. 

```tsx
this.get("/api/orders/:id", (schema, request) => {
  if(['error-id', 'timeout-id'].includes(request.params.id)) {
    return new Response(500, {}, {error: "something went wrong"});
  }
  
  return {
    id: request.params.id,
    status: "ready",
  };
});
```

And then, in our test, we can use either `error-id` or `timeout-id` as the `orderId` to simulate the error:

```tsx
it("shows a fallback call the store button", async () => {
  render(<DirectToBoot orderId="error-id"/>);

  await waitFor(() =>
    expect(
      screen.getByText("Seems something went wrong...")
    ).toBeInTheDocument(), { timeout: 3000});

  const button = screen.getByText("04 23 33");
  await waitFor(() => expect(button).toBeInTheDocument(), {timeout: 3000})
});
```

### Simulate Retries

In our feature, we also want to simulate the `long-running` order to make sure the UI won’t be blocked by the initial fetch. We can simulate it by defining a variable with `initialised` state and later on using a timer to update the value.

```tsx
const longRunningOrder = {
  id: 'long-running-order',
  status: "initialised",
}

//...
const createMockServer = () => createServer({
  routes() {
    this.get("/api/orders/:id", (schema, request) => {
      if(['long-running-order'].includes(id)) {
        const timerId = setTimeout(() => {
          longRunningOrder.status = 'ready'
          clearTimeout(timerId);
        }, 2000)

        return longRunningOrder;
      }
    });
  }
})
```

 

Then after several retries, the view finally gets the `ready` status and is ready for notifying the store. Note in the console mirage had done three retries in this case.

![Retry on failure](/posts/images/react-clean-code-network-mocking/retry-on-failure.png)

### Summary

In this article, we have discussed how to use `mirage.js` to simplify the network mocking for either impossible or difficult cases if you talk to real APIs in your frontend application. We looked at the happy path, error handling and retries with `mirage.js` , and also how easy it is to use `react-query` to simplify the logic of implementing the network-related code.

---

You can find the [full source code](https://github.com/abruzzi/direct-to-boot) for this article here. And if you prefer videos, I’ve published these in [my YouTuBe channel](https://www.youtube.com/@icodeit.juntao) in 2 one-hour-long videos. 

