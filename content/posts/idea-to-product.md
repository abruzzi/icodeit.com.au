---
title: "A story: from idea to product"
description: "As the saying goes: all great things have small beginnings. Even the most complicated product starts with a small and simple idea. And during the process of implementing it, even for a simple App like To Buy, there are many details to consider and polish."
date: 2020-10-28T15:46:12+11:00
cover: "/posts/images/idea-to-product/poster-dark-mode.png"
---

Undoubtedly, Covid-19 has, in many ways, affected our lives profoundly. Mandatory face masks when you go out for a coffee, social distancing in public, How to wash your hands in 6 steps, or the negative mental impacts since physical isolation because of working from home and so on. Those changes are shaping our life.

What I'm sharing today has something to do with covid-19. It's about how I built and published a mobile App from scratch after Daniel Andrews announced Victoria enters Disaster State for two months and I have to stay at home for almost 24 hours per day. All of these, of course, start from a single requirement.

## Requirement analysis
Actually, it's a quite old requirement from my wife. To avoid spending too long in a supermarket, some of us have a grocery shopping list like these index cards below:

![](/posts/images/idea-to-product/index-card.png)

I bet you may have something similar. There are a bunch of advantages of these lists: easy to carry, use and drop off, super convenient. However, there are some drawbacks as well: it's easy to lose one after use. If you don't use the index card with a pen, you have to check multiple times for some items to make sure you're not missing it. Additionally, the information on a small card can be limited, sometimes you need more descriptive information, such as buy some sweet corn from Lamanna & Sons if the price is 5 for 3. Or you need a specific type of tomato.

So I need an App that can help me with those lists. The main reason is I carry my mobile phone all the time, and it's a perfect replacement for paper and pen in the Todo list scenario. Also, the multimedia (photos, video, website) has many advantages over index cards.

Another typical shopping scenario is: I go shopping by visiting many supermarkets in one round. One supermarket has fresh veggies and fruits, and the other has all the life essentials, also for some specific items you can only buy them in Asian Supermarket. That's why I need the App to group items by supermarket so that I can purchase all items in one supermarket, and then I go to the next one.

Stage 4 lockdown in a way promoted the implementation of this idea: firstly I suddenly have more time than normal because of the lockdown (no exercise, no commute, no anything); secondly, every shopping has to be quick to avoid exposing myself too long into the crowd, and lastly, as one family can only go out once per day for shopping we need to carefully plan the shopping (software can simplify these process significantly)

You may think `Notes` or `Reminder` can relieve those pains as they all have `Todo` management built-in, but the problem is they are all generic tools that are not specifically designed for shopping. In terms of implementation, I'm not going to start with `Swift ` 101or any `Hello world` Apps, but set the goal first and then learn by practising, and eventually publish it as a tool that everyone can use.

## Implementation
So now I'm at ***I have a brilliant idea, and I need a developer*** stage. And coincidentally I am a developer myself, and now the only problem is I literally have zero experience on `Swift` or mobile App development. What's more, I understand that in a product there are a lot of miscellaneous items, such as user interface designing, icons, legal-related content, the publishing process and so on, those are all unknowns to me.

### Learn from doing approach

Generally speaking, I prefer to learn new techniques gradually. Start with a simple demo, and learn all the subjects one after another (user interface design, using a database, request resources via network and so on), this approach can make a solid foundation and practise various details fully. However, it normally takes too long to master a technique, maybe months without actually having anything published or tangible. And it's very easy to be interrupted by other tasks and can be challenging to pick up again.

On the other hand, you can also learn by doing, that means you have a goal defined first and use that goal to drive what you have to learn. For example, it's not necessary to learn network or database if you only need a standalone image editor App. The advantage of this manner is it can provide in-time feedback, and you always have a clear target.

Of course, there are some downsides as well:

- it can take a very long time for Googling or reading Stackoverflow answers
- some resource you found may outdated miserably, such as those component written in `Object-c` while I'm using `Swift`
- most of the content people sharing are way too simple, so basically you can not use them directly in your project

So I have tried to merge those two along the way. For example, in the first milestone. I mainly used a result-driven approach and learnt roughly only some necessary knowledge, such as TableView, MVC in iOS, how to use navigation, etc. The sources are primarily from youtube channels that basically teach you how to implement a simple Todo in Xcode. You can get familiar with XCode, key-maps, basic grammar of `Swift`, basic of Interface Designer and so on.

Then you can write your product code, with no rules. You can either write swift in JavaScript way or Java way, and it doesn't matter at this stage. If everything goes well, you should be able to build a prototype very soon. There are heaps of concrete problems emerged at this stage: how to add icons to the XCode project, how to config colours, or how two Views can talk to each other, how to sync data between parent and child view. But as an experienced developer all those can be solved by `Google + Stackoverflow` (maybe not all of them but most of them, at least you can walk around with some ugly solution for now).

After this stage, you will have a workable prototype, and it's time to polish it. I purchased an on sales online course about `Swift and iOS development` from `udemy` with the price of a soy latte. Then I started to learn more detailed content like how to use `protocol`, how to use `MVVM` pattern, how to define `segue` and so on. In the meanwhile, I fixed a few defects as well as did some refactor.

The image below illustrated how the UI evolved from the prototype to the latest one. It started with a default look and feel of `TableView`, and then some custom `TableCell`, every time it's a bit more complicated than the previous step, and every change is based on real user feedback.

![](/posts/images/idea-to-product/evolving.png)



A suggestion I would like to make here is: if you have plenty of time, go from basic and build your knowledge step by step so that you can have a solid understanding of the whole structure. But if you don't have that much time and worry about being distracted, then you just learn by doing. It's also important that you need to go back to basics when you have positive feedback (or more time).

### Project management

During the process, I found that a visualised, trackable story-board can really help. Surely you need a set of rules and make sure you're following those rules. For example, all stories must start from a Backlog column (which means it has to be analysed), and you need to confirm the priority of a task before kick it off, you will need to have a clear definition of done for a task. Also, you have to collect feedback when you implement. In other words, you should treat the side project more seriously, just like other normal projects.

In addition, I also noticed that at the beginning, I tend to breach a couple of agile practises that I have observed people keep ignoring on client site. Such as not updating the story on time, not controlling WIP numbers, or inserting temporary tasks into the Doing column directly without prioritising them properly, no clear acceptance criteria and so on. But after a few iterations, I changed the process and tried to make it more formal. And it does help me to focus on high priority, high-value features (instead of those are fancier)

![](/posts/images/idea-to-product/trello.png)

I think that's the cheapest option you should invest in a project, and also the most efficient one. Especially when you have been interrupted by some unexpected tasks (long weekend, or something you have to catch up for a client project), a simple story-board can help you rebuild that context and proceed.

## Go live
After around two weeks of learning/developing, I registered an Apple Developer account and submitted my first prototype. It contained three lists (product catalogue, to-buy list, and delayed item list), and it was rejected miserably because of [lack of functionalities](https://developer.apple.com/app-store/review/guidelines/#minimum-functionality). So I analysed it again more carefully, and I believe it might because the user interface, it's too rough and coarse, there are many places that need to be adjusted. Then I spent around a week to beautify it with font, font size, spacing, colour contrast and other small UI details. Also, I added a share list function (so you can share your list with others via Airdrop). And 3 hours after the second submission, it's approved.

For V1 it took me about three weeks, 2-3 hours per night and a bit more during the weekend. V2 also took me 2-3 weeks, apart from functionalities, there are so many supporting tasks such as `screenshots` poster design (more details in next section). By the way, I just found a serious issue on iOS 14 (because of Apple doesn't implement `NSFetchedResultsControllerDelegate` correctly, and if you happen to know how to walk around it, please do let me know), also if you noticed anything abnormal please provide me with some feedback. All the source code is hosted here on [Github](https://github.com/abruzzi/to-buy), so if you're interested in it or want to contribute please also let me know.

### To Buy *or Not To Buy?*

The App is called [To Buy: grocery shopping list](https://apps.apple.com/au/app/to-buy-grocery-shopping-list/id1531070172), and has already been published in [App Store](https://apps.apple.com/au/app/to-buy-grocery-shopping-list/id1531070172). That's the very first iOS App I designed, coded, architected and maintained (despite my wife and I being two primary users at the moment). I think that's a great start and pretty happy with its current state.

![](/posts/images/idea-to-product/iphone-6.5.png)

### Feature list

After a few versions (current V2.5.0) of iteration, now To Buy is essentially maintaining a grocery shopping list. It allows users to :

- Add an item by taking a photo from the camera, or by typing a name  
- Group items by supermarket so they can visit multip supermarket and focus on each of them at a time
- Add shopping item to a dictionary so they can easily pick up next time 
- Add a photo as a to-buy item directly from Photos App
- All data are automatically synced in iCloud so that they can share that across multiple devices
- Share items with others by a single tap

Another interesting thing I noticed is that: no matter how certain I was when I firstly contrive it, the final form would be very different from what I started. For instance, originally To Buy has a built-in dictionary that contains almost everything, and I found it's not used that often. The challenge is I have to tap a few times (in a few screens) when I just want to type something directly.

So in the end, `To Buy` has multiple entry points that users can either add an item by its name only (and then fulfil all the details later if they want) or take a photo or import from other Apps. Some other functions are not considered at all but eventually asked by users. Furthermore, the three tabs design is simplified to one single screen now.

## Some lessons learnt
During this from idea to implementation, and then to a published product, I have some new views about how to incubate a product (even a small one, and only solving a specific problem for myself). So I summarised them into a few categories and hope can give you some inspiration as well.

### Don't think too much

Compared to those who are new to the programming world (they're always curious and keen to learn anything), experienced developers are normally **balancing/thinking** too much. They tend to analyse the return on investment of a new technique, or how the prospect of that technology could be. It's definitely sensible to do some homework before you spend too much on some framework, but you need to beware that just don't overthink. 

Firstly, doing comparison itself across different candidates takes time. Secondly, you might forget where were you started after several rounds of *rational* analysis and comparisons, or even worse you may have some illusion that you've already mastered the technique by just learning the overviews. Finally, there are too many invisible parts that hide in the details, and only when you started to do it you can realise how deep it can be. 

The solution is simple, after the initial short research, start to fix a concrete problem by using that new thing you just learnt. And try to interact with the technique with the problem you're resolving.

### Don't pursue perfect

Just as what you hear all the time: *Perfect is the enemy of good*. That's so true when you implement an idea. It could be a more robust architecture style, or highest code coverage or automatic all the tests that aligned to test pyramid or implement MVVM in all the views. All of those above should have a lower priority than the main feature you're manufacturing. And I really doubt if you can really have that perfection in the future. I think pursuing perfect should be an incremental process, start with some simple solution for a concrete problem and gradually make it *better*.

We indeed have to polish every detail in a product iteratively, sometimes maybe pixel-level adjustment for a `view` in one of the screens. But setting up the working prototype that can be enhanced always has higher priority.

### If you don't know which way to go, choose the simplest one

It can be challenging to pick up a proper technical solution at the beginning; that's why you should pick something that simple. When a local file system is sufficient, then don't use a database; and if local calculation is enough don't try network. In the engineering world, every extra integration point means a higher possibility to fail. The failure rate of those integration points can accumulate and amplify that eventually it's almost certainly something would go wrong.

In other words, you need to delay to make decisions until you have to. In addition, we always have a chance to go back and adjust the direction. And also because of this, we should select the most straightforward approach, and even when the rewrite is inevitable in the future, it would be much easier.

### The devil is in the detail 

One thing that surprised me many times is those exciting and fancy features normally are pretty easy to implement. They are those tedious/simple ones like `i18n` or `accessibility`, recovery from an exception that takes much longer time than I thought.

![](/posts/images/idea-to-product/poster-dark-mode.png)



A good example is when I implement `dark mode` in my design. I have to adjust the background colour, highlight colour, text-background contrast ratio and so on many many times to make it look right. I need to make sure it works in every scenario and don't let the users notice my design. Those hidden details can require a lot of time and effort, but you have to accept the fact and treat them just as normal functionalities.

To make a good product, you need to calm down and carefully consider those *edge cases*. Those *thankless* features are just like the second burger in your lunch -- you can't just ignore the first one that made you 70% full. And when you are planning, you need to consider all those factors as well.

## Summary

As the saying goes: all great things have small beginnings. Even the most complicated product starts with a small and simple idea. And during the process of implementing it, even for a simple App like To Buy, there are many details to consider and polish.

Firstly, except the hard work, once you have a clear goal, you also need to consciously *break it down* to smaller pieces and prioritise them respectively and then implement. In the story above, I am one of the **stakeholders** and learning iOS is one of the project goals, so that will affect the way we prioritise tasks. That may not always be true in a client project.

Secondly, when you have a rough goal, you can start to design a few experiments and implement a prototype in the simplest way. Once you have a prototype, then it's much easier to enhance it than just have a perfect theory. When you're not sure which way to go, always choose the simplest approach. You should be aware of the complicity only emerges when you drill deep enough, and a decision made from that point is much reliable and feasible that you plan upfront.

What's more, if you see the whole process as a series of experiments, you can then just adjust different parameters and observe your results, and adjust them dynamically and eventually reach a feasible stage. Don't take the final product too seriously. It can be an **interesting exploration**, and the worst scenario is you learn plenty of knowledge about the topic and also have some excellent first-hand experience that you can rely on in your next adventure.


