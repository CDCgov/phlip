import streamsaver from 'streamsaver'
const queryString = require('query-string')
import { isLoggedIn, getToken, logout } from 'services/authToken'
import { fetchTimeout } from "./fetchTimeout";

export const exportLargeData = async (projectId, params, fileName) => {
	const url = `https://phlip2dev.philab.cdc.gov/api/exports/project/${projectId}/data?${queryString.stringify(params)}`
	const bearer = getToken();
	const headers = new Headers({
		"Authorization": `Bearer ${bearer}`
	})
	const fileStream = streamsaver.createWriteStream(fileName);
	const controller = new AbortController();

	return fetchTimeout(url,1000000, { signal: controller.signal, headers })
		.then(res => {
			const readableStream = res.body
			if (window.WritableStream && readableStream.pipeTo) {
				console.log('writable stream it is');
				return readableStream.pipeTo(fileStream)
					.then(() => console.log('done writing'))
			}

			const writer = fileStream.getWriter()

			const reader = res.body.getReader()
			console.log('made it here')
			const pump = () => reader.read()
				.then(res => {
					if(res.done) {
						return writer.close()
					} else {
						return writer.write(res.value).then(() => pump())
					}
				})
			return pump().then(() => {
				console.log('finished writing')
			});
		})

}

