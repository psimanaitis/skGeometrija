var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
ctx.canvas.width = 400;
ctx.canvas.height = 400;

function spausdinkDuomenis(selector, data) {
    var element = document.querySelectorAll(selector);
    var formedData = `

    <table class="table table-bordered table-striped table-condensed">
    <tr>
        <th>Segmento Nr</th>
        <th>Pradžios taškas</th>
        <th>Pabaigos taškas</th>
    </tr>
    `;
    data.forEach(function (segment, index) {
        formedData += `
            <tr>
                <td>
                    ${index + 1}
                </td>
                <td>
                    x: ${JSON.stringify(segment.p.x)}
                    y: ${JSON.stringify(segment.p.y)}
                </td>
                <td>
                    x: ${JSON.stringify(segment.q.x)}
                    y: ${JSON.stringify(segment.q.y)}
                </td>
            </tr>
        `    });
    formedData += `</table>`;
    element[0].innerHTML = formedData;
};

function drawLine(segmentas, spalva) {
    ctx.beginPath();
    ctx.moveTo(segmentas.p.x, segmentas.p.y);
    ctx.lineTo(segmentas.q.x, segmentas.q.y);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = spalva;
    ctx.stroke();
}

function generuokSegmentus(segmentai, count) {
    for (var i = 0; i < count; i++) {
        segmentai.push(
            {
                p: { x: getRandomInt(10, 400), y: getRandomInt(10, 400) },
                q: { x: getRandomInt(0, 400), y: getRandomInt(0, 400) }
            }
        );
    }
    return segmentai;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function vienodas(segmentas, kitas) {
    return (
        segmentas.p.x == kitas.p.x
        && segmentas.p.y == kitas.p.y
        && segmentas.q.x == kitas.q.x
        && segmentas.q.y == kitas.q.y
    )
};

function gaukYSegmente(segmentas, x) {
    return segmentas.p.y + ((segmentas.q.y - segmentas.p.y) / (segmentas.q.x - segmentas.p.x) * (x - segmentas.p.x));
};

function vertikalusAtstumasTS(taskas, segmentas) {
    if (taskas.x == segmentas.p.x) return segmentas.p.y - taskas.y;
    if (taskas.x == segmentas.q.x) return segmentas.q.y - taskas.y;
    if (taskas.x > segmentas.p.x && taskas.x < segmentas.q.x) {

        var yTaske = gaukYSegmente(segmentas, taskas.x);
        return yTaske - taskas.y;
    }
    return false
};

var pradiniaiSegmentai = [
    {
        p: { x: 10, y: 50 },
        q: { x: 190, y: 10 }
    },
    {
        p: { x: 45, y: 100 },
        q: { x: 180, y: 100 }
    },
    {
        p: { x: 10, y: 250 },
        q: { x: 190, y: 200 }
    },
    {
        p: { x: 10, y: 150 },
        q: { x: 190, y: 165 }
    },
    {
        p: { x: 5, y: 200 },
        q: { x: 195, y: 230 }
    },
    {
        p: { x: 40, y: 50 },
        q: { x: 380, y: 380 }
    },
    {
        p: {
            x: 110, y: 292
        },
        q: {
            x: 264,
            y: 162
        }
    },
    {
        p: {
            x: 331, y: 324
        },
        q: {
            x: 150,
            y: 296
        }
    }
];



pradiniaiSegmentai = generuokSegmentus(pradiniaiSegmentai, 5);

var aplink = aplinkSegmentai(pradiniaiSegmentai);

function aplinkSegmentai(segmentai) {
    return function (segmentas) {
        var kandidatai = segmentai.filter((temp) => {
            return temp.p.x <= segmentas.p.x && temp.q.x >= segmentas.p.x && !vienodas(temp, segmentas);
        });

        kandidatai.unshift({
            p: {
                x: segmentas.p.x,
                y: 0
            },
            q: {
                x: segmentas.q.x,
                y: 0
            }
        });

        var pTop = kandidatai.reduce(function (prev, current) {
            var atstumas = vertikalusAtstumasTS(segmentas.p, current);
            var prevAtstumas = vertikalusAtstumasTS(segmentas.p, prev);
            if (atstumas < 0 && atstumas > prevAtstumas) {
                return current;
            }
            return prev;
        });

        kandidatai.splice(0, 1, {
            p: {
                x: segmentas.p.x,
                y: 400
            },
            q: {
                x: segmentas.q.x,
                y: 400
            }
        });

        var pBottom = kandidatai.reduce(function (prev, current) {
            var atstumas = vertikalusAtstumasTS(segmentas.p, current);
            var prevAtstumas = vertikalusAtstumasTS(segmentas.p, prev);
            if (atstumas > 0 && atstumas < prevAtstumas) {
                return current;
            }
            return prev;
        });

        var kandidatai = segmentai.filter((temp) => {
            return temp.q.x >= segmentas.q.x && temp.p.x <= segmentas.q.x && !vienodas(temp, segmentas);
        });

        kandidatai.unshift({
            p: {
                x: segmentas.p.x,
                y: 0
            },
            q: {
                x: segmentas.q.x,
                y: 0
            }
        });

        var qTop = kandidatai.reduce(function (prev, current) {
            var atstumas = vertikalusAtstumasTS(segmentas.q, current);
            var prevAtstumas = vertikalusAtstumasTS(segmentas.q, prev);
            if (atstumas < 0 && atstumas > prevAtstumas) {
                return current;
            }
            return prev;
        });

        kandidatai.splice(0, 1, {
            p: {
                x: segmentas.p.x,
                y: 400
            },
            q: {
                x: segmentas.q.x,
                y: 400
            }
        });

        var qBottom = kandidatai.reduce(function (prev, current) {
            var atstumas = vertikalusAtstumasTS(segmentas.q, current);
            var prevAtstumas = vertikalusAtstumasTS(segmentas.q, prev);
            if (atstumas > 0 && atstumas < prevAtstumas) {
                return current;
            }
            return prev;
        });

        segmentas.pKaimynai = {
            top: pTop,
            bottom: pBottom
        };
        segmentas.qKaimynai = {
            top: qTop,
            bottom: qBottom
        }
    }
};

function trapecijuLinijos(segmentai) {
    segmentai.forEach(function (segmentas) {
        segmentas.p.tLinija = {
            p: {
                x: segmentas.p.x,
                y: 0
            },
            q: {
                x: segmentas.p.x,
                y: 400
            }
        };
        segmentas.q.tLinija = {
            p: {
                x: segmentas.q.x,
                y: 0
            },
            q: {
                x: segmentas.q.x,
                y: 400
            }
        };
        if (segmentas.pKaimynai.top) {
            segmentas.p.tLinija.p.y = gaukYSegmente(segmentas.pKaimynai.top, segmentas.p.x);
        }
        if (segmentas.pKaimynai.bottom) {
            segmentas.p.tLinija.q.y = gaukYSegmente(segmentas.pKaimynai.bottom, segmentas.p.x);
        }
        if (segmentas.qKaimynai.top) {
            segmentas.q.tLinija.p.y = gaukYSegmente(segmentas.qKaimynai.top, segmentas.q.x);
        }
        if (segmentas.qKaimynai.bottom) {
            segmentas.q.tLinija.q.y = gaukYSegmente(segmentas.qKaimynai.bottom, segmentas.q.x);
        }
    });
}

pradiniaiSegmentai.forEach(function (segmentas) {
    if (segmentas.p.x > segmentas.q.x) {
        var temp = {
            x: segmentas.p.x,
            y: segmentas.p.y
        }

        segmentas.p.x = segmentas.q.x;
        segmentas.p.y = segmentas.q.y;

        segmentas.q.x = temp.x;
        segmentas.q.y = temp.y;

    }
});

pradiniaiSegmentai.forEach(function (segmentas, index) {
    aplink(segmentas);
});

trapecijuLinijos(pradiniaiSegmentai);


pradiniaiSegmentai.forEach(function (segmentas) {
    drawLine(segmentas, 'black');
    drawLine(segmentas.p.tLinija, 'red');
    drawLine(segmentas.q.tLinija, 'red');
});

spausdinkDuomenis('#segments', pradiniaiSegmentai);


var trapecijuLinojos = pradiniaiSegmentai.map(function (segmentas) {
    return segmentas.p.tLinija;
});

trapecijuLinojos = trapecijuLinojos.concat(pradiniaiSegmentai.map(function (segmentas) {
    return segmentas.q.tLinija;
}));

spausdinkDuomenis('#TLines', trapecijuLinojos);

window.generuok = function () {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var kiekis = document.getElementById('kiekis').value;
    pradiniaiSegmentai = generuokSegmentus([], kiekis);


    pradiniaiSegmentai.forEach(function (segmentas) {
        if (segmentas.p.x > segmentas.q.x) {
            var temp = {
                x: segmentas.p.x,
                y: segmentas.p.y
            }

            segmentas.p.x = segmentas.q.x;
            segmentas.p.y = segmentas.q.y;

            segmentas.q.x = temp.x;
            segmentas.q.y = temp.y;

        }
    });

    var aplink = aplinkSegmentai(pradiniaiSegmentai);


    pradiniaiSegmentai.forEach(function (segmentas, index) {
        aplink(segmentas);
    });

    pradiniaiSegmentai.forEach(function (segmentas, index) {
        trapecijuLinijos(pradiniaiSegmentai);
    });


    pradiniaiSegmentai.forEach(function (segmentas) {
        drawLine(segmentas, 'black');
        drawLine(segmentas.p.tLinija, 'red');
        drawLine(segmentas.q.tLinija, 'red');
    });

    spausdinkDuomenis('#segments', pradiniaiSegmentai);


    var trapecijuLinojos = pradiniaiSegmentai.map(function (segmentas) {
        return segmentas.p.tLinija;
    });

    trapecijuLinojos = trapecijuLinojos.concat(pradiniaiSegmentai.map(function (segmentas) {
        return segmentas.q.tLinija;
    }));

    spausdinkDuomenis('#TLines', trapecijuLinojos);

}