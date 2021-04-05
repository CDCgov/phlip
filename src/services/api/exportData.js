import streamsaver from 'streamsaver'
const queryString = require('query-string')
import { isLoggedIn, getToken, logout } from 'services/authToken'



export const exportLargeData = async (projectId, params, fileName) => {
	const url = `${process.env.APP_API_URL}/exports/project/${projectId}/data?${queryString.stringify(params)}`
	const bearer = getToken();
	const headers = new Headers({
		"Authorization": `Bearer ${bearer}`
	})
	const fileStream = streamsaver.createWriteStream(fileName);
	fetch(url, { headers })
		.then(res => {
			const readableStream = res.body
			if (window.WritableStream && readableStream.pipeTo) {
				console.log('writable stream it is');
				return readableStream.pipeTo(fileStream)
					.then(() => console.log('done writing'))
			}

			window.writer = fileStream.getWriter()

			const reader = res.body.getReader()
			const pump = () => reader.read()
				.then(res => res.done
					? writer.close()
					: writer.write(res.value).then(pump))
			return pump().then(() => {
				console.log('finished writing')
			})
		})

}

