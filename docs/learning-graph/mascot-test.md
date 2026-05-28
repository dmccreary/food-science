---
title: Mascot Style Guide
description: Rendering test for all Zyme the Yeast Cell admonition styles
---

# Mascot Style Guide

This page shows all seven mascot admonition styles for Zyme the Yeast Cell.
Use it to verify that images load correctly, colors match the book theme,
and text wraps cleanly around the floated mascot image.

---

## Neutral

!!! mascot-neutral "A Note from Zyme"
    <img src="../../img/mascot/neutral.png" class="mascot-admonition-img" alt="Zyme neutral pose">
    Use this for general sidebars, introductions, or any content that
    doesn't call for a specific emotional tone.

---

## Welcome

!!! mascot-welcome "Welcome!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Zyme waving welcome">
    Science is delicious! In this chapter we're going to explore some of the
    most fascinating science hiding in the food you eat every day. Get ready
    to see your kitchen with completely new eyes!

---

## Thinking

!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Zyme thinking">
    This is the thinking style, used to highlight key concepts and
    "aha" moments. The orange header draws the eye to the big idea.

---

## Tip

!!! mascot-tip "Zyme's Tip"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Zyme giving a tip">
    This is the tip style, used for hints, shortcuts, and helpful guidance
    that makes a lab or concept easier to master.

---

## Warning

!!! mascot-warning "Watch Out!"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Zyme warning">
    This is the warning style, used to flag common mistakes and pitfalls
    before students make them. A little caution now saves a lot of trouble later!

---

## Celebration

!!! mascot-celebration "Great Work!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Zyme celebrating">
    This is the celebration style, used at the end of chapters and after
    students master a difficult concept. Science is delicious — and so is success!

---

## Encourage

!!! mascot-encourage "You Can Do This!"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Zyme encouraging">
    This is the encouraging style, used when students hit a tough concept
    or a tricky lab step. Zyme believes in you — every scientist struggles
    before they bubble up to the top!

---

## Image Border Check

The bordered versions below let you verify image dimensions and padding.
Remove the `border` style once you're satisfied with image sizing.

!!! mascot-neutral "Border Check — Neutral"
    <img src="../../img/mascot/neutral.png" class="mascot-admonition-img" alt="Zyme neutral" style="border: 2px solid red;">
    If there is excessive empty space around Zyme inside the red border,
    run the padding trimmer:
    `python $BK_HOME/src/image-utils/trim-padding-from-image.py docs/img/mascot/neutral.png`
