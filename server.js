const http = require('http');
const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');

const ticketsStorage = [
  {
    name: 'hi from backend',
    description: 'hello! it is default ticket',
    id: 1,
    created: 'today'
  }
];

app.use(koaBody({
  urlencoded: true,
  }));

app.use(async ctx => {
  ctx.response.set({
    'Access-Control-Allow-Origin': '*',
  });

  const req = ctx.request.querystring;
  reqArr = req.split('&');
  reqObj = {};
  for (const item of reqArr) {
    itemArr = item.split('=');
    reqObj[itemArr[0]] = itemArr[1];
  }

  switch ( reqObj.method ) {
      case 'allTickets':
          ctx.response.body = ticketsStorage;
          return;
      case 'postTicket':
          const {name, description} = ctx.request.body;
          if (ctx.request.body.id) {
            const existingTicket = ticketsStorage.find(item => item.id == ctx.request.body.id);
            const updatedObj = {
              name: name,
              description: description,
              created: existingTicket.created,
              id: existingTicket.id,
            }
            ticketsStorage.splice(ticketsStorage.indexOf(existingTicket));
            ticketsStorage.push(updatedObj);
          } else {
            const objToAdd = {
              name: name,
              description: description,
              created: new Date,
              id: Math.floor(Math.random() * 10000),
            }
            ticketsStorage.push(objToAdd);
          }
          return;
      case 'getTicket':
          for (const item of ticketsStorage) {
            if (item.id == reqObj.id) {
              ctx.response.body = item.description;
            }
          }
          return;
      case 'deleteTicket':
          const toDel = ticketsStorage.find(item => item.id == reqObj.id);
          ticketsStorage.splice(ticketsStorage.indexOf(toDel))
          ctx.response.status = 200;
          return;
      default:
          ctx.response.status = 404;
          return;
  }
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
