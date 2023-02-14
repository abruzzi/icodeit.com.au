---
title: "Implementing Design System"
description: "So it’s not a single standard of how you would design at scale but a set of standards, and it is a visual language, which is important both by the user experience design and implementation..."
date: 2022-11-19T17:15:59+11:00
cover: "/posts/images/implementing-design-system/cypress-vr.png"
---

## What is a design system?

There are hundreds of definitions of what a design system is, and I think [this one](https://www.nngroup.com/articles/design-systems-101/) is generic enough and also has most of the essential elements:

> A design system is a set of standards to manage design at scale by reducing redundancy while creating a shared language and visual consistency across different pages and channels.
> 

So it’s not a single standard of how you would design at scale but a set of standards, and it is a visual language, which is important both by the user experience design and implementation. Lastly, consistency is the key here, and you will want all the products to have the same patterns in terms of user experience.

## What is the problem a design system trying to solve?

Imagine you have built an online application that works successfully, and your customers love it. So as the business grows, you want to add a few more features to the application, so several new pages are needed. 

There are a few things you need to consider here. For new UI elements (for example, an accordion you don’t have on any other pages), you will need some design work upfront, and then the developers can start implementing them. But there will usually be some back and forth here, like how much of the `border radius`, what’s the delay for the open accordion animation, and how about the `box-shadow` spread radius? 

For these existing elements, like a button used on other pages, may need a “little bit” tackle to be used on the new page. 

And as your business keeps growing, these activities have to happen repeatedly and frequently, and you may need to build other products but still want the visual identity to remain. And you don’t want to do all the processes above over and over again. 

Note that I’m not just talking about visual details (they are critical for sure) like elevation, colour, typography, layout, image, animation, etc. But also accessibility, the language, the tones you use on different pages.

Imagine you need to upgrade some details of your company's visual identity, like the font face or branding colour. Just think about how many places you have to update in code and also how you can ensure, well, the most important thing, consistency.

And that’s the **design at scale** we’re talking about here.

## The challenges you might face

But building a design system is a challenging thing. There are tons of things that need to consider.  In this article, I’ll try to summarise a few important aspects I think of as a developer. 

Extracting the code from your current codebase and separating them into a package should be the first step of building a design system. And that’s only the tip of the iceberg of the system. There are many other details you may not aware of but can make it fail or a success.

### Accessibility

For a serious design system, accessibility is not optional but a must. You need to build keyboard navigation, you need to use `ARIA` attributes when needed, and the colour contrast ratio should satisfy [the minimal requirement](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) of WCAG.

For example, in [Material UI](https://mui.com/) and [Atlassian Design System](https://atlassian.design/), you can use the keyboard to do almost every action: navigate to the next link, search for a document, switch between dark and light modes, etc.

![Material UI](/posts/images//implementing-design-system/mui.png)

But not all design systems are built the same. [Ant Design](https://ant.design/) - the most popular “design system” in China, doesn’t have any visual indicator when you navigate by a keyboard. You cannot see the highlight ring around links or so.

![Ant Design](/posts/images//implementing-design-system/antd.png)

### Upgrading a new version

> With a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of your system will be depended on by somebody.

— Hyrum Wright
> 

The key here is “observable behaviours”, meaning even if it’s not in the document, when people accidentally find it can be used that way, they (some of them) will rely on that behaviour, which could cause difficulty when upgrading.

Once a package is released and some product teams start to use it, you need to prepare a lot of subsequent tasks around version bumpings and migrations:

- What steps need to take when it’s a breaking change
- When the upgrade has some issues, what would you do? Downgrade to the old version or patch the new one
- What if some products use a version 3 majors behind and would like to upgrade to the latest version? How easy is it?

![codemods](/posts/images/implementing-design-system/codemods.png)

By using tools like jscodeshift (with codemod script), upgrading can be simplified a lot. But still, there will be some difficult cases you might miss. So get ready for some ad-hoc hacks here as well. I have a full article to talk about how to [use codemod and jscodeshift](https://itnext.io/automatic-refactoring-with-jscodeshift-codemods-45c219eaf992) to automatically upgrade a breaking API.

### Testing Strategy

It’s needless to say that how important the test is to any codebase, and the test pyramid theory applies to design system components. In addition to the unit tests, which focus more on the isolated test without the real browser involved, and integration tests, which put some components together and see if they work well in all the supported browsers (with different versions as well), you will need **visual regression tests** as well. 

Using tools like [browserstack](https://www.browserstack.com/), you can test all these browsers in different versions and ensure they work well on all environments. 

Visual Regression Tests check pixel-by-pixel how a component renders on a certain screen size. They are normally considered too expensive in regular web applications but is mandatory in the design system context. 

Below is a concrete example of how it runs in a real scenario. I was using `cypress` + `cypress-visual-regression` to do the check. There are many other alternatives. Both commercial ([browserstack](https://www.browserstack.com/percy/visual-testing)) and open-source frameworks are available. 

![cypress-vr](/posts/images/implementing-design-system/cypress-vr.png)

And in the implementation, I swapped the two products in the order detail section, and so the visual regression detected the difference:

![cypress-vr](/posts/images/implementing-design-system/cypress-vr-result.png)

You may also want to adjust the threshold of the differences between the `base` and `actual` screenshots just in case it’s too sensitive. For example, sometimes a pixel box-shadow size might be tolerable.

![adjust the threshold](/posts/images/implementing-design-system/threshold.png)

### Documents

It’s easy to overlook how important the document could be in a design system. If you could make it a **live document**, like embedding a codesanbox in the page so that the consumer (developer) can play around with the code, that would be awesome.

![live document](/posts/images/implementing-design-system/live-document.png)

Also, a good document should include guidance on when a product should pick up what components to make the user experience more natural. In Atlassian Design System, the usage of a component has a few clearly defined sections, like **Anatomy**, **Behaviour**, **Best practices and Content guidelines**, etc.

![live document](/posts/images/implementing-design-system/ds-document.png)

### Business As Usual

When you’re big enough to attract internal and external users, it comes together with the supporting and on-call duties. People might use the components in an unexpected way (so you need more time to investigate), and you may need to make sure the message is always consistent as a team(so that the consumer doesn't feel confused).

Ask people to provide a working example can be super helpful for you to investigate, like a codesandbox or codepen with minimal code that can reproduce the case. And after you fix the issue, you can update the example section in your documents of the component, too, so that when people stumbled into the same issue will get their answer from the doc.

### The ownership of the Design System

In a company that doesn't have a huge developer team, the product team can own the design system as there aren’t many users anyway. However, if the business grows to a certain size. Not only will the efforts to develop new features and maintain the code be huge, but also the domain knowledge of the design system is different to the product, so you need to have a dedicated team for the design system. 

The product team may focus on how to fetch data and transform it into some shape that can be used by a `Order` or `UserProfile` component, while the design system focuses more on tokens, the performance of the individual component, and how to make them more composable and such. 

## Summary

A design System is a great way to ensure your product's user experience remains consistent and relieves some pain when designing at scale. But it’s not free, actually, it is pretty expensive than you thought. Extracting a common component library is the simple first step, there are 80% of the work afterwards. 

You need to plan a lot on version upgrading, documents and BAU. You will need a team behind it as that’s a different domain than your normal business model.

## References

- [Design System 101](https://www.nngroup.com/articles/design-systems-101/)
- [Everything You Need To Know About Design Systems](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)
- [Did someone say composition](https://javascript.plainenglish.io/did-someone-say-composition-c7843d898b2)
- [Automatic refactoring with jscodeshift/codemods](https://itnext.io/automatic-refactoring-with-jscodeshift-codemods-45c219eaf992)
