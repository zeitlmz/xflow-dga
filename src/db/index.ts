import mysql from 'mysql'

export const dbUtil = (type: string, host: string, port: number, user: string, password: string, database: string) => {
    switch (type) {
        case 'mysql':
            return mysql.createPool({
                connectionLimit: 10,
                host: host,
                port: port,
                user: user,
                password: password,
                database: database
            })
        case 'oracle':
            return
    }
}

export const oracleConn = () => {

}