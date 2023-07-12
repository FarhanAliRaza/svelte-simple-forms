<script>
	import { createForm } from '$lib';

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
			min: 6,
            equalTo: 'password'
		}
	});

	$: {
		form.validate();
	}
</script>
<form class="p-10">
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



<style>
    .center {


    }

    .p-10{
        margin: 50px 50px 50px 50px;
    }
    label {
        display: block;
        margin-bottom: 1rem;

    }
    input {
        display: block;
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
    }
</style>