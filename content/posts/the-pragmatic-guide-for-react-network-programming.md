---
title: "The Pragmatic Guide for React Network Programming"
date: 2022-12-16T21:52:12+11:00
description: "Fetching data from a remote server can be challenging, especially when you have to consider cache, re-fetch, error handling, timeout etc..."
cover: "/posts/images/the-pragmatic-guide-for-react-network-programming/cover.png"
---

In this article, I want to share some pragmatic tips for writing better React applications that involve network requests, like, every React application. I will start with the challenges we as developers are facing in dealing with network requests and try to separate these challenges out of the React build views, encapsulate the monster into a cage (into a hook), and finally use `react-query` to simplify as a final touch.

[You can also find the origin article in medium](https://itnext.io/the-pragmatic-guide-to-react-network-programming-c6f9de9962ed), but I may extend the content here about how to test network related code (and that would be too long for a medium article I reckon).

In the end, you should be able to build a fairly robust and organised component and supporting functions that are easier to test and maintain. 

The application we’re going to build is a simple user list. As you can imagine, implementing it is straightforward: fetch data from remote in a `useEffect` hook, and render the list once it is fetched.

![user list](/posts/images/the-pragmatic-guide-for-react-network-programming/user-list.png)

## Using humble fetch API

Let's break down the simple application into some steps so I can easily reveal all the "dark sides" of network programming in React.

### The happy path

Fetching remote data from the server side in React is not super difficult. Use `fetch` with the right URL with the resource and convert the data into JSON, and you are ready to go.

```tsx
const [users, setUsers] = useState<User[]>([])

useEffect(() => {
  const fetchUsers = () => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }

  fetchUsers();
}, []);
```

But that is only a small part of the whole story. Normally you will need the loading status for slower requests to improve the user experience. 

### Loading indicator

With a little bit of change, you can still do it. At the beginning of the network request, you can set a loading indicator as `true` and reset it once you have returned the data. And you can use that flag for rendering a spinner to let the user know something is going on.

```tsx
const [users, setUsers] = useState<User[]>([])
const [loading, setLoading] = useState<boolean>(false);

useEffect(() => {
  const fetchUsers = () => {
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setUsers(data)
      });
  }

  fetchUsers();
}, []);

if(loading) {
  return <Spinner />
}
```

And you can do the regular render when you have the data.

### Things are not always working as expected.

In the real world, things go wrong (or at least not what you’re expecting). Network issues, authentication failure, session expired, incorrect data in the payload, earthquakes, flood and who knows. 

The last thing you want to see is a single error blow up the whole application. And that’s why you need error handling, and when it occurs you need to let the user know (or retry for a couple of times)

```tsx
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string>('');

useEffect(() => {
  const fetchUsers = () => {
    setLoading(true);

    fetch('https://jsonplaceholder.typicode.com/users2')
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          setLoading(false);
          throw Error(response.statusText);
        }
      })
      .then((data) => {
        setLoading(false);
        setUsers(data)
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
      });
  }

  fetchUsers();
}, []);

if(error) {
  return <ErrorMessage />
}
```

Again, with a little bit of change, you can achieve what is expected. The only catch here is that `fetch` by default doesn’t treat `4xx` or `5xx` as errors, so we need to check the status and throw conditionally.

![error](/posts/images/the-pragmatic-guide-for-react-network-programming/error.png)

You can surely use other library like `axios` to relieve the pain a little.

```tsx
useEffect(() => {
  const fetchUsers = () => {
    setLoading(true);

    axios.get('https://jsonplaceholder.typicode.com/users')
      .then((response: AxiosResponse<User[]>) => {
        setLoading(false);
        setUsers(response.data)
      }).catch((e) => {
        setLoading(false);
        setError(e);
    })
  }

  fetchUsers();
}, []);
```

The current code works well. But I feel the code is pretty distracting when I read it. Many things are going on here, and we also need these similar code in other network requests. And in real-world applications, this is still a pretty simplified version of a production code. 

For example, there are some pretty standard things we’re missing:

- retry when a temporary error happens (like an unstable network, we should retry a few times at least)
- poll requests for some checks (like a health check or status check requests)
- cancel requests when not needed, or the same request is initiated again.

### Let's try one more time.

Implementing a retry can be error-prone as there are a bunch more statuses you need to take care of. For example, we can add an instance state `retryCount` and increase it every second before resending the network request. We usually would gradually increase the retry time span to ensure the remote recovers. 

```tsx
const retryCount = useRef<number>(0);

useEffect(() => {
	//... fetchUsers
  const intervalId = setInterval(() => {
    if(error === null) {
      fetchUsers();
			clearInterval(intervalId);
    } else if (retryCount.current < 3) {
      retryCount.current = retryCount.current + 1;
      fetchUsers();
    } else {
      clearInterval(intervalId);
    }
  }, 1000);

  return () => {
    clearInterval(intervalId);
  }
}, [error]);
```

To adjust the interval time span, we will have to introduce one more state, potentially making the code even harder to read. the general fact is that the longer the file, the easier bugs can slip in. (***Note: There is actually a bug in the code above, so don't use it in your production***)

I assume you are already aware of the "ugliness" of the current implementation. How can we fix the hard-to-maintain problem here, then? One approach is to extract the whole `useEffect` block into a separate hook and do all the wild things there.

## Some clean-ups and refactorings

### Extract the effect code into a hook

By simply copying the code of the state and `useEffect` part into a separate function `useFetchUsers` , we have the new hook that manages all the network-related logic:

```tsx
const useFetchUsers = () => {
  const [users, setUsers] = useState<User[] | undefined>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const retryCount = useRef<number>(0);

  useEffect(() => {
    const fetchUsers = () => {
			//...
    }

    const intervalId = setInterval(() => {
			//...
    }, 1000);

    return () => {
      clearInterval(intervalId);
    }
  }, [error]);

  return {
    users,
    loading,
    error
  }
}
```

We can even split the logic here in `fetchUsers`. It currently does two things: sending a network request and setting local states. We can define a function that focuses only on the network, including set HTTP headers, network timeout and authentications etc. 

```tsx
const fetchUsers = async (): Promise<User[] | undefined> => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return (response.data as User[]);
  } catch (e) {
    new Error('fetch users data error')
  }
}
```

And the code in our original component can be simplified quite a lot into:

```tsx
export const UserList = () => {
  const {loading, error, users} = useFetchUsers();

  if(loading) {
    return <Spinner />
  }

  if(error) {
    return <ErrorMessage />
  }

  return (<div>
    {(users || []).map(user => {
      return (<article key={user.id} className="container">
        <h3>{user.name}</h3>
        <p className="description">
          <span className="avatar">
            <img src={`https://avatars.dicebear.com/api/adventurer/${user.email}.svg`} alt={user.name} />
          </span>
          <span>{user.name} works for {user.company.name}.</span>
        </p>
      </article>)
    })}
  </div>)
}
```

That looks much better now. The hook provides data and different statuses, while the view is responsible for rendering data (with different user interface states).

Essentially we have three parts that are responsible for three different aspects of the application:

1. A list view for rendering data (the happy path), as well as `loading` and `error` states
2. A hook that arranges all the statuses of the application and retries logic when necessary
3. A fetch function handling network-related work: sets HTTP headers, defines timeout, etc.

With this separation of concerns, there is still room for improvement. Especially the network states management.

### One step further

I suppose at this stage, you’re aware of how complicated the network-related code can be (and again, that’s only part of the story). Luckily we have `react-query` from `tanstack` that can simplify the whole process much more easily.

```tsx
yarn add @tanstack/react-query --save
```

To use the `react-query` you will need to wrap your application into a `Provider`, so that all the children nodes can access the query client. `react-query` provides many useful hooks that can simplify the logic significantly. 

In our `useFetchUsers` hook, the code with `react-query` is like the following:

```tsx
import { useQuery } from "@tanstack/react-query";

const useFetchUsers = () => {
  const {
    isLoading: loading,
    error,
    data: users,
  } = useQuery(["fetchUsers"], fetchUsers, { retry: 3 });

  return {
    users,
    loading,
    error,
  };
};
```

That’s it. All the statuses are now managed by `react-query` itself, as well as the retry logic, cache, auto-re-fetching when the data is stale, etc. 

[Comparsion between with and without react-query](https://twitter.com/JuntaoQiu/status/1603354029803077632?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1603354029803077632%7Ctwgr%5Eedad9076d267cd63edf7d57302e92ed3e93e3ae6%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Fcdn.embedly.com%2Fwidgets%2Fmedia.html%3Ftype%3Dtext2Fhtmlkey%3Da19fcc184b9711e1b4764040d3dc5c07schema%3Dtwitterurl%3Dhttps3A%2F%2Ftwitter.com%2Fjuntaoqiu%2Fstatus%2F1603354029803077632image%3Dhttps3A%2F%2Fi.embed.ly%2F1%2Fimage3Furl3Dhttps253A252F252Fabs.twimg.com252Ferrors252Flogo46x38.png26key3Da19fcc184b9711e1b4764040d3dc5c07)


So you call `useQuery` hook with three parameters: the query key acts like an id for the query so you can reference it in other places (to cancel it, for example, or evaluate the cache if it’s a mutation). The second parameter is the function that returns a promise or an error. And an optional options object, you can define how many times you want to retry when something goes wrong, the delay between each retry and many other things.

Note here with `react-query`, you can replace the `fetchUsers` function, which makes the underlying network requests with a humble `fetch` call. 

There are many other benefits of using `react-query` , I’ll excerpt a few from the homepage. 

> - Caching... (possibly the hardest thing to do in programming)
> - Deduping multiple requests for the same data into a single request
> - Updating "out of date" data in the background
> - Knowing when data is "out of date"
> - Reflecting updates to data as quickly as possible
> - Performance optimizations like pagination and lazy loading data
> - Managing memory and garbage collection of server state
> - Memoizing query results with structural sharing

I’m not going to discuss too many features of `react-query`. Instead, I’d like to emphasise more on the separation of concerns. As you have seen, how we extracted things into different places makes the switch pretty straightforward. It would help if you always considered that when you write your React code or do refactorings. 

## Summary

Working with the network isn’t easy. Many things must be considered: protocol, header, cache, timeout, retry when the error occurs and managing different statuses. `react-query` can make the developers’ life a bit easier. On top of that, you still need to isolate these challenges from views and the underlying network client (either the `fetch` or `axios` client).