<script lang="ts">
	let conversion_rates = {} as any;
	let currencyList: any[] = [];

	const currency = {
		of: 'USD',
		to: 'RUB',
	};

	const values = {
		of: 1,
		to: 1,
	};

	const fetchCurrencyData = async (c: string) => {
		const data = await fetch(
			`https://v6.exchangerate-api.com/v6/b72d9696695875489536e885/latest/${c}`,
		).then((res) => res.json());

		conversion_rates = data.conversion_rates;
		currencyList = Object.keys(data.conversion_rates);

		currency.of = c;

		values.of = 1;
		values.to = calc(conversion_rates[currency.to]);
	};

	const onCurrencyChange = (newCurrency: string) => {
		currency.to = newCurrency;
		values.to = calc(conversion_rates[newCurrency] * values.of);
	};

	const setValue = (value: number, type: 'of' | 'to') => {
		values[type] = calc(value);
	};

	const calc = (value: number) => Number(value.toFixed(2));

	fetchCurrencyData(currency.of);
</script>

<div>
	{#await conversion_rates}
		<span>Loading currency</span>
	{:then conversion_rates}
		<div class="card">
			<div class="item">
				<input
					type="number"
					class="input"
					bind:value={values.of}
					on:input={() => {
						setValue(conversion_rates[currency.to] * values.of, 'to');
					}}
				/>
				<select
					name="currency_of"
					value={currency.of}
					on:change={async (e) => {
						await fetchCurrencyData(e.currentTarget.value);
					}}
				>
					{#each currencyList as currency}
						<option value={currency}>
							{currency}
						</option>
					{/each}
				</select>
			</div>
			<div class="item">
				<input
					type="number"
					class="input"
					bind:value={values.to}
					on:input={() => {
						setValue(values.to / conversion_rates[currency.to], 'of');
					}}
				/>
				<select
					name="currency_to"
					value={currency.to}
					on:change={(e) => {
						onCurrencyChange(e.currentTarget.value);
					}}
				>
					{#each currencyList as currency}
						<option value={currency}>
							{currency}
						</option>
					{/each}
				</select>
			</div>
		</div>
	{/await}
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		row-gap: 10px;
	}
	.input {
		padding: 5px 10px;
		border-radius: 5px;
		border: none;
	}
</style>
