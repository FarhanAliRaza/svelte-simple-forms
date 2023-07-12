# Svelte Simple Forms
This is a simple package for client side form validation for svelte and sveltekit without schemas.
It has simple syntax for setting up validators for your fields 

## Usage


```js
import { createForm } from "svelte-simple-forms";

const form = createForm({
		email: {
			email: true,
			required: true
		},
		password: {
			required: true,
			min: 6
		},
        repassword: {
			required: true,
            equalTo: 'password'
		}
	});

	$: {
		form.validate();
	}
```


```svelte

<form class="">
    <label>
        Email
        <input type="email" bind:value={form.email} />
            {#each form.errors.email as error}
                <p>{error}</p>
            {/each}
    </label>
    
    <label>
        Passowrd
        <input type="email" bind:value={form.password} />
            {#each form.errors.password as error}
                <p>{error}</p>
            {/each}
    </label>
    
    <label>
        RePassoword
        <input type="email" bind:value={form.repassword} />
            {#each form.errors.repassword as error}
                <p>{error}</p>
            {/each}
    </label>
</form>
```

You can contribute and report issues at [Github](https://github.com/FarhanAliRaza/svelte-simple-forms).


[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/eO-C7Oz2UaE/0.jpg)](https://www.youtube.com/watch?v=eO-C7Oz2UaE)
