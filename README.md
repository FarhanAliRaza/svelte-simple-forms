# Svelte Simple Forms
This is a simple package for client side form validation for svelte and sveltekit without schemas.
It has simple syntax for setting up validators for your fields 

## Usage


```js
import { form } from "svelte-simple-forms";

form.init(
    {
        email: {
            required:true,
            email: true,
        },
        password:{
            required:true,
            min:6,
            max:16
        }
    }
)

$:{
    $form
    form.validate() // validate on every change 
}
```


```svelte

<input
    bind:value={$form.email}
/>
{#if $form.emailData.error}
    {$form.emailData.error}
{/if}

<input
    bind:value={$form.password}
/>
{#if $form.passwordData.error}
    {$form.passwordData.error}
{/if}
```

You can contribute and report issues at [Github](https://github.com/FarhanAliRaza/svelte-simple-forms).
