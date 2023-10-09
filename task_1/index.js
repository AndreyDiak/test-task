import { encoded, translations } from './data.js';

console.log("Let's rock");
// console.log(encoded, translations);

function decoded(encodedList = encoded, dictionary = translations) {
	const result = [];

	const entriesIdsMap = {};

	for (const encoded of encodedList) {
		const { groupId, service, formatSize, ca, ...fieldsToDecode } = encoded;

		const decodedFields = Object.entries(fieldsToDecode).reduce((total, [key, value]) => {
			// обновляем мапку с подсчетом id
			entriesIdsMap[value] = (entriesIdsMap[value] ?? 0) + 1;

			return {
				...total,
				[key]: dictionary[value] ?? null,
			};
		}, {});

		result.push({ groupId, service, formatSize, ca, ...decodedFields });
	}

	const uniqueIds = Object.entries(entriesIdsMap)
		// находим id которые встретились только один раз
		.filter(([_, value]) => value === 1)
		// берем только id
		.map(([key, _]) => key);

	return {
		decoded: result,
		uniqueIds,
	};
}

console.log(decoded());
