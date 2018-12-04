const express = require('express');
const app = express();
const port = 3000;
const connection = require('./conf');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// Support URL-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

// Récupération de l 'ensemble des données de la table avion
app.get('/api/avion', (req, res) => {
    connection.query('SELECT * from avion', (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération des avions');
        } else {
            res.json(results);
        }
    });
});

// Récupération de l'ensemble des données de la table pilotes
app.get('/api/pilote/names', (req, res) => {
    connection.query('SELECT nom_pil from pilotes', (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération des pilotes');
        } else {
            res.json(results);
        }
    });
});

// Récupération d'un ensemble des avion ou le nom commence par z :
app.get('/api/avion/debut', (req, res) => {
    connection.query(`SELECT nom_av, capacite from avion where nom_av like 'z%'`, (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération des avions');
        } else {
            res.json(results);
        }
    });
});

// Récupération des pilotes ou le nom contient 'waza'
app.get('/api/pilote/contient', (req, res) => {
    connection.query(`SELECT nom_pil, adresse from pilotes where nom_pil like '%waza%'`, (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération des pilotes');
        } else {
            res.json(results);
        }
    });
});

// Récupération des pilotes ou la date_embauche >'2000-04-01'
app.get('/api/pilote/sup', (req, res) => {
    connection.query(`SELECT nom_pil, date_embauche from pilotes where date_embauche >'2000-04-01'`, (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération des pilotes');
        } else {
            res.json(results);
        }
    });
});
//Récupération tous les pilotes trier par salaire(ordre passer en url)
app.get('/api/pilotes/:order', (req, res) => {
    const order = req.params.order;
    connection.query(`SELECT * from pilotes order by salaire ${order}`, (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération des pilotes');
        } else {
            res.json(results);
        }
    });
});
//ajout avion
app.post('/api/avion/add', (req, res) => {
    const myData = req.body;
    connection.query('INSERT INTO avion SET ?', myData, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Erreur lors de la sauvegarde d'un avion");
        } else {
            res.sendStatus(200);
        }

    });

});
// modification pilote
app.put('/api/pilote/:id', (req, res) => {

    const idPil = req.params.id;
    const data = req.body;

    connection.query('UPDATE pilotes SET ? WHERE id_pil = ?', [data, idPil], err => {
        if (err) {
            console.log(err);
            res.status(500).send("Erreur lors de la modification d'un pilote");
        } else {
            res.sendStatus(200);
        }
    });
});

//toggle boolean
app.put('/api/avion/:status', (req, res) => {

    const status = req.params.status;
    const data = req.body;

    connection.query('UPDATE avion SET ? WHERE status= ?', [data, status], err => {
        if (err) {
            console.log(err);
            res.status(500).send("Erreur lors de la modification d'un avion");
        } else {
            res.sendStatus(200);
        }
    });
});

//supression d'un vol

app.delete('/api/vol/:id', (req, res) => {
    const idVol = req.params.id;
    connection.query('DELETE FROM vols WHERE id_vol = ?', [idVol], err => {
        if (err) {
            console.log(err);
            res.status(500).send("Erreur lors de la suppression d'un vol");
        } else {
            res.sendStatus(200);
        }

    });
});

//supression d'un avion

app.delete('/api/avions/:status', (req, res) => {
    const status = req.params.status;
    connection.query('DELETE FROM avion WHERE status = ?', [status], err => {
        if (err) {
            console.log(err);
            res.status(500).send("Erreur lors de la suppression d'un avion");
        } else {
            res.sendStatus(200);
        }

    });
});
app.listen(port, (err) => {
    if (err) {
        throw new Error('Something bad happened...');
    }

    console.log(`Server is listening on ${port}`);
});