Component directives
====================

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/svelte-4/documentation/docs/02-template-syntax/06-component-directives.md)

on:_eventname_[permalink](#on-eventname)

-----------------------------------------

    on:eventname={handler}

Components can emit events using [`createEventDispatcher`](/docs/svelte#createeventdispatcher)
 or by forwarding DOM events.

    <script>
    	import { createEventDispatcher } from 'svelte';
    
    	const dispatch = createEventDispatcher();
    </script>
    
    <!-- programmatic dispatching -->
    <button on:click={() => dispatch('hello')}> one </button>
    
    <!-- declarative event forwarding -->
    <button on:click> two </button>

Listening for component events looks the same as listening for DOM events:

    <SomeComponent on:whatever={handler} />

As with DOM events, if the `on:` directive is used without a value, the event will be forwarded, meaning that a consumer can listen for it.

    <SomeComponent on:whatever />

\--style-props[permalink](#style-props)

----------------------------------------

    --style-props="anycssvalue"

You can also pass styles as props to components for the purposes of theming, using CSS custom properties.

Svelte's implementation is essentially syntactic sugar for adding a wrapper element. This example:

    <Slider bind:value min={0} --rail-color="black" --track-color="rgb(0, 0, 255)" />

Desugars to this:

    <div style="display: contents; --rail-color: black; --track-color: rgb(0, 0, 255)">
    	<Slider bind:value min={0} max={100} />
    </div>

**Note**: Since this is an extra `<div>`, beware that your CSS structure might accidentally target this. Be mindful of this added wrapper element when using this feature.

For SVG namespace, the example above desugars into using `<g>` instead:

    <g style="--rail-color: black; --track-color: rgb(0, 0, 255)">
    	<Slider bind:value min={0} max={100} />
    </g>

**Note**: Since this is an extra `<g>`, beware that your CSS structure might accidentally target this. Be mindful of this added wrapper element when using this feature.

Svelte's CSS Variables support allows for easily themeable components:

    <style>
    	.potato-slider-rail {
    		background-color: var(--rail-color, var(--theme-color, 'purple'));
    	}
    </style>

So you can set a high-level theme color:

    /* global.css */
    html {
    	--theme-color: black;
    }

Or override it at the consumer level:

    <Slider --rail-color="goldenrod" />

bind:_property_[permalink](#bind-property)

-------------------------------------------

    bind:property={variable}

You can bind to component props using the same syntax as for elements.

    <Keypad bind:value={pin} />

While Svelte props are reactive without binding, that reactivity only flows downward into the component by default. Using `bind:property` allows changes to the property from within the component to flow back up out of the component.

bind:this[permalink](#bind-this)

---------------------------------

    bind:this={component_instance}

Components also support `bind:this`, allowing you to interact with component instances programmatically.

    <ShoppingCart bind:this={cart} />
    
    <button on:click={() => cart.empty()}> Empty shopping cart </button>

> Note that we can't do `{cart.empty}` since `cart` is `undefined` when the button is first rendered and throws an error.

previous [Element directives](/docs/element-directives)

next [Special elements](/docs/special-elements)