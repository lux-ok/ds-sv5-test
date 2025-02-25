<script lang="ts">
	import { z } from 'zod';
	import { dataChecker, type DcSchema, type DcBaseResult } from '../../../../dc/src/dc';

	const schema = z.object({
		name: z.string().min(4),
		age: z.number().min(8).max(12).nullable(),
		address: z.object({
			city: z.string().max(5),
			zip: z
				.string()
				.min(3)
				.refine((val) => Number(val) <= 125)
		})
	});

	type MyType = z.infer<typeof schema>;

	const origin: MyType = {
		name: 'Tommy',
		age: 10,
		address: { city: 'macau', zip: '123' }
	};
	const target = $state(structuredClone(origin));
	const checker = dataChecker({ schema, origin });

	let nameState = $derived(checker.name.state(target.name));
	let ageState = $derived(checker.age.state(target.age));
	let cityState = $derived(checker.address.city.state(target.address.city));
	let zipState = $derived(checker.address.zip.state(target.address.zip));
</script>

<section>Data checker test</section>

<section>
	<p>[ Origin ]</p>
	<p>Name: {origin.name}</p>
	<p>Age: {origin.age}</p>
	<p>City: {origin.address.city}</p>
	<p>Zip: {origin.address.zip}</p>
</section>

<section>
	<label for="name">Name</label><input
		type="text"
		id="name"
		bind:value={target.name}
		class:changed={nameState.isChanged}
		class:invalid={nameState.isInvalid}
	/>
	<label for="age">Age</label><input
		type="number"
		id="age"
		bind:value={target.age}
		class:changed={ageState.isChanged}
		class:invalid={ageState.isInvalid}
	/>
	<label for="city">City</label><input
		type="text"
		id="city"
		bind:value={target.address.city}
		class:changed={cityState.isChanged}
		class:invalid={cityState.isInvalid}
	/>
	<label for="zip">Zip</label><input
		type="text"
		id="zip"
		bind:value={target.address.zip}
		class:changed={zipState.isChanged}
		class:invalid={zipState.isInvalid}
	/>
</section>

<style>
	input {
		border-width: 1px;
		padding: 0.5rem 1rem;
	}

	.changed {
		background-color: lightgoldenrodyellow;
	}

	.invalid {
		color: orangered;
	}

	section {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-bottom-width: 1px;
	}

	div-checkbox {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
		border-right-width: 1px;
		width: 18rem;
	}

	button {
		border-width: 1px;
		padding: 0.5rem 1rem;

		&:hover {
			background-color: lightskyblue;
			cursor: pointer;
		}
	}
</style>
