const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'pug')
app.set('views', path.join(__dirname), '.')

require('dotenv').config()
const apiKey = process.env.AIRTABLE_API_KEY

const Airtable = require('airtable')
const base = new Airtable({ apiKey: apiKey }).base('apptXtK9JFNJ7wBrX')

let records

app.get('/', async (req, res) => {
	if (records) {
		console.log('cached')
		res.render('page', {
			records,
		})
	} else {
		// list records in Business Hours
		(async () => {
			records = await base('Business Hours')
				.select({
					view: 'Grid view',
				})
				.firstPage()

			for (record of records) {
				console.log(record.get('Day'), record.get('Hours'))
			}

			res.render('page', {
				records,
      })
      
      setTimeout(() => {
        records = null
      }, 10 * 1000);
		})()
	}
})


app.listen(port, () => console.log(`App listening on port ${port}!`));
