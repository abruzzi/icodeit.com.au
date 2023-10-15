---
title: "If I Could Only Teach One Thing to a Beginner Developer"
description: "A few weeks ago, I got an interesting idea when I was writing a blog post about how to abstract your code to make it easier to reuse. I wanted to know what other developers think is the most important principle they would teach a newbie developer and why they would choose that design principle."
date: 2022-12-01T15:46:12+11:00
cover: "/posts/images/if-i-could-only-teach-one-thing-to-a-beginner-developer/cover.png"
---

A few weeks ago, I got an interesting idea when I was writing a blog post about how to [abstract your code](https://itnext.io/how-to-write-more-reusable-code-73f936283eff) to make it easier to reuse. I wanted to know what other developers think is the most important principle they would teach a newbie developer and why they would choose that design principle.

So I did a few different “interviews”, some over WeChat, a few by Google Forms and the rest from a Google Chat thread internally. 

![Interview](/posts/images/if-i-could-only-teach-one-thing-to-a-beginner-developer/interview.png)

## Single Responsibility Principle

The result is super exciting. The top 1 principle is the “Single Responsibility Principle”, or SRP for short. Although there are other interpretations, normally, SRP means you should keep your function, class or module as simple and coherent as possible. 

One concrete example of that would be like something I exerted from the Google Chat thread:

> …**I suggest to them to give their functions meaningful names (relates to point one) and see if they have to use conjunctions like and/or to define what the function is doing. If that's the case, they should split that function…**
> 

It applied to different levels in your code as well. For example, a class should not do two different unrelated things. A data class `Person` may have `name`, `address` and `dob`, but the method `deliver` would be too much.

![S.R.P](/posts/images/if-i-could-only-teach-one-thing-to-a-beginner-developer/srp.png)

## Encapsulation

The second highest selected topic is encapsulation. Naively it could mean do not use scattered data or functions, they need to be encapsulated inside a class or so. But beyond that, it can also mean you need to know what data and methods need to be placed where. 

I’ll use the example from my other article here, and show how we can use `class` to encapsulate these exposed data easily.

It’s common to see these small data transform functions along with React component, and as the way fontend consume these data changes (mapping abbr to full name, or adding if else logic when required), these small top level functions started hard to maintain.

![With functions](/posts/images/if-i-could-only-teach-one-thing-to-a-beginner-developer/with-functions.png)

We could then have a `class` for all the data and transform functions. And we have a single place to modify if any logic for that transform changed, it’s also easier to set up the tests — you define the input with some variations and verify the output of the public methods from the class.

![With class](/posts/images/if-i-could-only-teach-one-thing-to-a-beginner-developer/with-class.png)

## Don’t Repeat Yourself

Number three on the list is DRY - Don’t Repeat Yourself. We all hate to do repeat work when coding, especially when we have to it manually. Generally speaking, [Rule of three](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)) applies in most cases, meaning that you can accept only less than three instances of duplication. 

One thing to notice here, just like other principles in software development, you should seek to understand to purpose behind the duplication first, and then demolish that duplication. There are a few interesting readings (I’ve put in the reference section at the bottom) cases when you should not remove the duplication.

I found different programming languages provides mechanisms make the DRY easier or harder, for example, in functional programming languages, because function are first-class, you can pass them around just like variables, which is not possible in pure object-oriented languages.

![Higher Order Function](/posts/images/if-i-could-only-teach-one-thing-to-a-beginner-developer/higher-order-func.png)

And then you can pass in **any** function to avoid duplications, like:

![Using HOF](/posts/images/if-i-could-only-teach-one-thing-to-a-beginner-developer/using-hof.png)

While in Java, for example (if my Java knowledge is out-of-dated, please comment to let me know), you have to create an interface first and pass in classes that implementing the interface to make it happen, which is pretty cumbersome. 

## Summary

These top three principles are rooted in most of the developer's’ mind, although there are some slight different interpretation from person to person. SRP ensure you only focus on one thing and make it perfect, and if done well the testability and composability are all following. While encapsulation helps you to put coherent content, algorithm, data and logic into a centric place, which on the other way help easier to understand to code. And lastly, DRY keeps the code always in a simple and concise state, also you don’t have to worries about forgetting to update the other places when modifying.

---

### References:

- [Don’t Repeat Yourself](https://www.plutora.com/blog/understanding-the-dry-dont-repeat-yourself-principle)
- [Goodbye Clean Code](https://overreacted.io/goodbye-clean-code/)
- [The wrong abstraction](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction)
