# \# NOVA — Motion \& Interactions Pass



\## Purpose



This task must be completed ONLY after the NOVA website is fully implemented,

responsive, and functionally stable.



The goal is to add subtle, premium interactions and motion throughout the website.



NOVA should feel like a modern digital studio/startup — polished, intentional,

interactive and contemporary — without feeling overly animated.



Motion should enhance the experience, never distract from the content.



The overall feeling should be:



\- Minimal

\- Editorial

\- Modern

\- Premium

\- Smooth

\- Subtle

\- Responsive

\- Professional



Avoid flashy animations, excessive movement, exaggerated parallax,

large zoom effects, bouncing elements, or anything that makes the website

feel like a template or experimental portfolio.



\---



\# GLOBAL MOTION PRINCIPLES



Use consistent motion throughout the website.



Animations should generally use:



\- smooth easing

\- subtle movement distances

\- short-to-medium durations

\- opacity transitions

\- small translateY / translateX values

\- subtle scale changes when appropriate



Prefer transforms and opacity for performance.



Animations should feel natural and soft.



Recommended general behavior:



Fast UI interactions:

150–250ms



Hover interactions:

200–350ms



Section reveals:

500–800ms



Large editorial reveals:

700–1000ms



Stagger between elements:

50–150ms



Do not animate everything.



Whitespace and stillness are part of the design.



\---



\# ACCESSIBILITY



Respect:



prefers-reduced-motion



If the user has reduced motion enabled:



\- Disable parallax.

\- Disable cursor-following effects.

\- Remove large entrance transitions.

\- Keep simple opacity transitions only.

\- Do not make animations necessary to understand content.



The website must remain completely usable without animations.



\---



\# HEADER



Keep the header clean and stable.



Navigation links should have subtle hover feedback.



Possible interaction:



Work

Services

Process

About



On hover, show a very thin underline that expands horizontally.



Avoid dramatic navigation animations.



The main CTA can have a subtle arrow movement:



Start a project ↗



On hover:



\- button changes slightly

\- arrow moves approximately 2–4px diagonally

\- transition around 200ms



\---



\# HOME — FLOATING HERO ELEMENTS



The homepage hero contains small decorative elements such as:



\- code icon

\- arrows

\- handwritten notes

\- small interface objects



Add extremely subtle floating movement.



Some objects may slowly move vertically approximately:



4–10px



Use slightly different durations so they do not move together.



Example:



element 1 → 5s

element 2 → 7s

element 3 → 6s



Use ease-in-out and alternate directions.



\---



\## Mouse Parallax



On desktop only, decorative hero elements can react slightly to cursor movement.



Maximum displacement:



5–15px



Different elements should move at slightly different speeds.



Do NOT move:



\- headline

\- paragraph

\- CTA

\- navigation

\- essential content



Only decorative elements should participate.



Disable this behavior on touch devices.



\---



\# SCROLL REVEALS



Sections should subtly reveal as they enter the viewport.



Default behavior:



opacity: 0 → 1



translateY:

20–30px → 0



Use approximately:



600–800ms



Do not trigger the animation repeatedly every time the user scrolls up and down.



Most reveals should happen once.



For grouped elements, use subtle staggering.



\---



\# WORK / PROJECTS



The Work page should have one of the strongest interactive moments.



Each project is presented as a large individual section with significant

vertical spacing.



Projects alternate:



Project 1:

visual left / text right



Project 2:

text left / visual right



Project 3:

visual left / text right



etc.



\---



\## Device Mockup Hover



When the cursor enters a project's visual area:



Laptop / desktop mockup:

translateY approximately -4px



Phone:

translateY approximately -7px



Increase the device shadow very slightly.



Do not dramatically scale the devices.



The effect should feel similar to premium e-commerce product photography.



\---



\## Cursor Project Preview



Inside the PROJECT IMAGE AREA ONLY, show a custom circular cursor.



Example:



\[ View project ↗ ]



The circle follows the mouse with slight interpolation/delay.



It should NOT replace the cursor throughout the website.



Behavior:



mouse enters project visual

→ cursor bubble fades/scales in



mouse moves

→ bubble follows smoothly



mouse leaves

→ bubble fades/scales out



The bubble should communicate that the entire project visual is clickable.



Disable on touch devices.



\---



\## Project Entrance



When a project enters the viewport:



Device visual:

opacity 0 → 1

translateY 25px → 0



Project description:

opacity 0 → 1

translateY 20px → 0



Use a slight delay between image and text.



Do NOT slide projects dramatically from the left/right.



\---



\# SERVICES



Services should NOT reuse the Work page interactions.



Each service has its own illustration/PNG composition.



Services:



Web Design

Development

E-commerce

Digital Presence



Animate the internal illustration pieces when each service enters the viewport.



\---



\## Web Design



Design-related objects may appear sequentially.



Examples:



layout

typography

color

UI elements



Use subtle staggered reveals.



\---



\## Development



Small development elements can float around the main illustration.



Examples:



</>

{ }

API

CSS

01



Movement must be extremely subtle.



They can move 3–8px over several seconds.



\---



\## E-commerce



The e-commerce illustration contains overlapping website/product windows.



Reveal them sequentially.



Example:



window 1 appears

→ 100ms

window 2 appears

→ 100ms

window 3 appears



Use:



opacity

translateY

very small scale



The result should resemble windows being layered together.



\---



\## Digital Presence



Elements representing:



SEO

Analytics

Search

Targeting

Performance

Growth



can appear around the central illustration.



Use staggered reveals.



Avoid continuous excessive movement.



\---



\# PROCESS SECTION



The Process section should feel connected to scrolling.



Stages:



01 Discover

02 Plan

03 Design

04 Develop

05 Launch \& Support



The process should visually activate progressively as the user scrolls.



\---



\## Scroll Progress



Initially, upcoming steps can have slightly reduced opacity.



As the user progresses through the section:



Discover activates

→ connector progresses

→ Plan activates

→ connector progresses

→ Design activates

→ Develop

→ Launch \& Support



Active stage:



opacity: 1

icon scale: approximately 1.03–1.06



Inactive:



opacity approximately 0.4–0.6



Do not use aggressive scaling.



\---



\## Connectors



The arrows or lines connecting each stage should visually draw or fill

as progress reaches the next stage.



The animation should be tied to scroll position where practical.



The section should still make complete sense if JavaScript or animations fail.



\---



\# ABOUT



The About page should use more editorial motion.



Do NOT use floating icons here.



\---



\## Hero Typography



Reveal the main headline line-by-line.



Example:



Creative solutions

for modern

businesses.



Each line:



opacity 0 → 1

translateY 20px → 0



Use approximately 80–120ms stagger.



Italic/emphasized words may appear slightly after the main text.



\---



\## Photography Reveal



Large photography should use a mask/clip reveal.



Example:



clip-path or overflow container



image gradually reveals vertically or horizontally.



Do NOT zoom the image dramatically.



A tiny scale from approximately:



1.02 → 1



is acceptable.



\---



\## Founder Section



Keep this section calm.



Image and copy should reveal independently with a slight timing difference.



Avoid animations that make the portrait feel like a product card.



\---



\# START A PROJECT



The Start a Project experience should behave like onboarding rather than

a traditional contact form.



Do NOT show every question simultaneously.



Use a multi-step flow.



\---



\## Step 01



What are we building?



Options:



New website

Redesign

E-commerce

Something else



When the user chooses an option:



\- selected card becomes active

\- subtle border/background transition

\- proceed to next step



\---



\## Step 02



What stage are you at?



Options:



Just an idea

Ready to start

Existing website



\---



\## Step 03



When would you like to get started?



Options:



As soon as possible

In 1–3 months

In 3–6 months

In 6+ months



\---



\## Step 04



Contact details.



Fields may include:



Name

Email

Company

Project description



CTA:



Send project →



\---



\## Step Transitions



When advancing:



Current content:

opacity 1 → 0

translateX 0 → -15px



Next content:

opacity 0 → 1

translateX 15px → 0



Keep transition around:



300–450ms



Do NOT make the entire browser page slide.



Only animate the form content.



\---



\## Progress Indicator



Show:



01 ━━━ 02 ━━━ 03 ━━━ 04



Progress should animate smoothly as steps are completed.



Users must be able to go backwards without losing their answers.



Do not submit until the final step.



\---



\# LANGUAGE MODAL



The website supports:



English

Français

Español



On the user's first visit, show the language selector.



Before or as the selector becomes visible, animate greetings:



Hola

Hello

Bonjour



Sequence:



Hola enters from left

→ pauses briefly

→ exits right



Hello enters from left

→ pauses

→ exits right



Bonjour enters from left

→ pauses

→ settles into the language selection interface



Suggested timing:



entrance: 350–500ms

pause: 500–700ms

exit: 300–450ms



Do not make the intro longer than necessary.



The entire greeting sequence should ideally take approximately 2–3 seconds.



Allow the user to interact without waiting for a long animation.



\---



\## Language Persistence



Once a language is selected, persist the preference.



Do NOT display the language modal on every page navigation.



The selected language should remain active throughout the session and

future visits where appropriate.



Provide a language switcher somewhere discreet in the website so users

can change it later.



\---



\# FOOTER REVEAL



This is an important visual signature of NOVA.



The footer should feel as though it exists underneath the main website.



Main content:



white / off-white

positioned visually above footer

bottom corners rounded



Footer:



dark / black

behind the main content



As the user reaches the end of the page, the main content moves upward

and progressively reveals the dark footer underneath.



IMPORTANT:



Do NOT use waves.

Do NOT use irregular SVG shapes.

Do NOT use curved decorative paths.



The only shape should come from the bottom border radius of the main

content container.



Example concept:



┌─────────────────────────────┐

│                             │

│       MAIN CONTENT          │

│                             │

╰─────────────────────────────╯

&#x20;      rounded corners



███████████████████████████████

████████ DARK FOOTER ██████████

███████████████████████████████



The effect should feel architectural and clean.



Use CSS positioning/sticky behavior where possible instead of unnecessarily

complex JavaScript.



On mobile, simplify the reveal if necessary for performance.



\---



\# BUTTON MICROINTERACTIONS



Buttons throughout NOVA should share consistent behavior.



Primary black button:



hover:

slight background change

arrow translateX 2–4px



Secondary outlined buttons:



hover:

very light gray background

border becomes slightly darker



Do not scale buttons aggressively.



\---



\# LINKS



Text links with arrows:



Learn more →

View project ↗

Explore services ↗



On hover:



text stays stable

arrow moves 2–4px



Optional subtle underline reveal.



\---



\# PERFORMANCE



Animations must not compromise performance.



Prefer:



transform

opacity



Avoid animating:



width

height

top

left



when transforms can achieve the same result.



Use IntersectionObserver where appropriate.



Do not create unnecessary continuous requestAnimationFrame loops.



Cursor/parallax animations should use requestAnimationFrame efficiently.



Lazy-load non-critical imagery.



Avoid adding a large animation library unless the project already uses one

or the complexity genuinely requires it.



If the project already uses Framer Motion, GSAP, Motion, or an equivalent

library, reuse the existing solution instead of introducing another one.



\---



\# RESPONSIVE BEHAVIOR



Desktop can include:



\- mouse parallax

\- custom project cursor

\- more complex scroll interactions



Tablet should simplify some effects.



Mobile should prioritize:



\- opacity reveals

\- small translate animations

\- step transitions

\- process progression

\- image reveals



Disable cursor-dependent effects on touch devices.



Never make hover required to discover content.



\---



\# FINAL POLISH PASS



After implementing all interactions:



1\. Review the entire website from beginning to end.

2\. Reduce animations that feel repetitive.

3\. Ensure different pages do not all use the exact same reveal.

4\. Check that animation timing feels consistent.

5\. Verify mobile performance.

6\. Verify keyboard navigation.

7\. Verify reduced-motion behavior.

8\. Verify language persistence.

9\. Verify form state persists when moving backward between steps.

10\. Verify animations do not cause layout shifts.

11\. Verify footer reveal works across different page lengths.

12\. Verify interactions do not interfere with links, forms, scrolling,

&#x20;   or accessibility.



The final website should feel interactive because details respond naturally

to the user — not because everything is moving.



When uncertain, choose less motion.

