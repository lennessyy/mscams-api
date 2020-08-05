const faker = require('faker')

const UserBaseQuery = `INSERT INTO users (category, first_name, last_name, email, username, password) VALUES `

const userGenerator = (num) => {
    const users = []
    for (let i = 0; i < num; i++) {
        const fname = faker.name.firstName()
        const lname = faker.name.lastName()
        const email = faker.internet.email()
        const username = faker.internet.userName()
        const password = faker.internet.password()
        users.push(`('student', '${fname}', '${lname}', '${email}', '${username}', '${password}')`)
    }
    return users.join(', ')
}

const finalUserQuery = UserBaseQuery + userGenerator(10) + ';'

console.log(finalUserQuery)

const applicantList = ['lennessy', 'Jess33', 'Claire21', 'Amber30', 'Jackson41', 'Greg.DuBuque', 'Esperanza_Jenkins24', 'Devan_Parker98']

const randApplicant = () => applicantList[Math.floor(Math.random() * applicantList.length)]

const applicationBaseQuery = `INSERT INTO applications (applicant, event, event_date, category, amount, description, budget) VALUES `

const generateDate = () => {
    const date = faker.date.future()
    const month = date.getMonth()
    const year = date.getFullYear()
    const day = date.getDate()
    return `${month}/${day}/${year}`
}

const applicationGenerator = (num) => {
    const appliactions = []
    for (let i = 0; i < num; i++) {
        const event = faker.lorem.words()
        const event_date = generateDate()
        const description = faker.lorem.text()
        const budget = faker.lorem.text()
        const applicant = randApplicant()
        const amount = Math.floor(Math.random() * 350)
        appliactions.push(`('${applicant}', '${event}', '${event_date}', 'pdf', '${amount}', '${description}', '${budget}')`)
    }
    return appliactions.join(', ')
}

const finalAppQuery = applicationBaseQuery + applicationGenerator(10) + ';'

console.log(finalAppQuery)