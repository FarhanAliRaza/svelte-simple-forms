
<script>

    import { form } from "$lib";

    form.init(
        {
            email:{
                email:true,
                required:true
            }
        }
    )

    $:{
        console.log($form)
        form.validate()
    }
    

</script>


<input type="email" bind:value={$form.email} />
{#if $form.emailData.error}
    <p>{$form.emailData.error}</p>
{/if}


