Logic blocks
============

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/svelte-4/documentation/docs/02-template-syntax/03-logic-blocks.md)

{#if ...}[permalink](#if)

--------------------------

    {#if expression}...{/if}

    {#if expression}...{:else if expression}...{/if}

    {#if expression}...{:else}...{/if}

Content that is conditionally rendered can be wrapped in an if block.

    {#if answer === 42}
    	<p>what was the question?</p>
    {/if}

Additional conditions can be added with `{:else if expression}`, optionally ending in an `{:else}` clause.

    {#if porridge.temperature > 100}
    	<p>too hot!</p>
    {:else if 80 > porridge.temperature}
    	<p>too cold!</p>
    {:else}
    	<p>just right!</p>
    {/if}

(Blocks don't have to wrap elements, they can also wrap text within elements!)

{#each ...}[permalink](#each)

------------------------------

    {#each expression as name}...{/each}

    {#each expression as name, index}...{/each}

    {#each expression as name (key)}...{/each}

    {#each expression as name, index (key)}...{/each}

    {#each expression as name}...{:else}...{/each}

Iterating over lists of values can be done with an each block.

    <h1>Shopping list</h1>
    <ul>
    	{#each items as item}
    		<li>{item.name} x {item.qty}</li>
    	{/each}
    </ul>

You can use each blocks to iterate over any array or array-like value — that is, any object with a `length` property.

An each block can also specify an _index_, equivalent to the second argument in an `array.map(...)` callback:

    {#each items as item, i}
    	<li>{i + 1}: {item.name} x {item.qty}</li>
    {/each}

If a _key_ expression is provided — which must uniquely identify each list item — Svelte will use it to diff the list when data changes, rather than adding or removing items at the end. The key can be any object, but strings and numbers are recommended since they allow identity to persist when the objects themselves change.

    {#each items as item (item.id)}
    	<li>{item.name} x {item.qty}</li>
    {/each}
    
    <!-- or with additional index value -->
    {#each items as item, i (item.id)}
    	<li>{i + 1}: {item.name} x {item.qty}</li>
    {/each}

You can freely use destructuring and rest patterns in each blocks.

    {#each items as { id, name, qty }, i (id)}
    	<li>{i + 1}: {name} x {qty}</li>
    {/each}
    
    {#each objects as { id, ...rest }}
    	<li><span>{id}</span><MyComponent {...rest} /></li>
    {/each}
    
    {#each items as [id, ...rest]}
    	<li><span>{id}</span><MyComponent values={rest} /></li>
    {/each}

An each block can also have an `{:else}` clause, which is rendered if the list is empty.

    {#each todos as todo}
    	<p>{todo.text}</p>
    {:else}
    	<p>No tasks today!</p>
    {/each}

Since Svelte 4 it is possible to iterate over iterables like `Map` or `Set`. Iterables need to be finite and static (they shouldn't change while being iterated over). Under the hood, they are transformed to an array using `Array.from` before being passed off to rendering. If you're writing performance-sensitive code, try to avoid iterables and use regular arrays as they are more performant.

{#await ...}[permalink](#await)

--------------------------------

    {#await expression}...{:then name}...{:catch name}...{/await}

    {#await expression}...{:then name}...{/await}

    {#await expression then name}...{/await}

    {#await expression catch name}...{/await}

Await blocks allow you to branch on the three possible states of a Promise — pending, fulfilled or rejected. In SSR mode, only the pending branch will be rendered on the server. If the provided expression is not a Promise only the fulfilled branch will be rendered, including in SSR mode.

    {#await promise}
    	<!-- promise is pending -->
    	<p>waiting for the promise to resolve...</p>
    {:then value}
    	<!-- promise was fulfilled or not a Promise -->
    	<p>The value is {value}</p>
    {:catch error}
    	<!-- promise was rejected -->
    	<p>Something went wrong: {error.message}</p>
    {/await}

The `catch` block can be omitted if you don't need to render anything when the promise rejects (or no error is possible).

    {#await promise}
    	<!-- promise is pending -->
    	<p>waiting for the promise to resolve...</p>
    {:then value}
    	<!-- promise was fulfilled -->
    	<p>The value is {value}</p>
    {/await}

If you don't care about the pending state, you can also omit the initial block.

    {#await promise then value}
    	<p>The value is {value}</p>
    {/await}

Similarly, if you only want to show the error state, you can omit the `then` block.

    {#await promise catch error}
    	<p>The error is {error}</p>
    {/await}

{#key ...}[permalink](#key)

----------------------------

    {#key expression}...{/key}

Key blocks destroy and recreate their contents when the value of an expression changes.

This is useful if you want an element to play its transition whenever a value changes.

    {#key value}
    	<div transition:fade>{value}</div>
    {/key}

When used around components, this will cause them to be reinstantiated and reinitialised.

    {#key value}
    	<Component />
    {/key}

previous [Basic markup](/docs/basic-markup)

next [Special tags](/docs/special-tags)