require('dotenv').config();
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const secreto = process.env.JWT
const port = 3000;
const agentes = require('./data/agentes.js')



app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.render('index');
});


app.get("/", (req, res) => {
    const { email, password } = req.query;
    const user = agentes.find((a) => a.email == email && a.password == password);
    if (user) {
        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 120,
                data: user,
            },
            secreto
        );
        res.send(`
    <a href="/Dashboard?token=${token}"> <p> Ir al Dashboard </p> </a>
    Bienvenido, ${email}.
    <script>
    localStorage.setItem('token', JSON.stringify("${token}"))
    </script>
    `);
    } else {
        res.send("Usuario o contraseña incorrecta");
    }
});

app.get("/Dashboard", (req, res) => {
    let { token } = req.query;
    jwt.verify(token, secretKey, (err, decoded) => {
        err
            ? res.status(401).send({
                error: "401 Unauthorized",
                message: err.message,
            })
            :
            res.send(`
    Bienvenido al Dashboard ${decoded.data.email}
    `);
    });
});

app.listen(port, () => console.log('Iniciando en puerto: ' + port));