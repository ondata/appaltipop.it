# AppaltiPOP by @ondatait

> Diamo agli appalti un'aria più pop... insieme a te!

Ogni anno le Pubbliche amministrazioni italiane spendono una cifra che si aggira intorno ai 150 miliardi di euro in Appalti Pubblici, per creare infrastrutture e servizi, oppure per acquistare beni.

Monitorare i dati degli appalti è difficilissimo anche per loro ed è fondamentale che i cittadini si diano da fare per attivare un controllo civico. Il nostro progetto permette di rendere più facili queste azioni di monitoraggio.

## Web application

Running instance: https://www.appaltipop.it/.

### Source code

Public repository: https://github.com/ondata/appaltipop.it.

Source code is released under a [MIT](https://opensource.org/licenses/MIT) license on Github. Contributions are welcome. Feel free to open issues and submit a pull request at any time!

### Software architecture

This application is composed by three services:
- a reverse proxy as a middleware between client and nextjs application and between nextjs application and the database
- a nextjs application with SSR enabled
- an interactive API documentation

The database is an instance of Elasticsearch v7.9.

### Production

You can deploy and run the application in a production environment using [Docker](https://www.docker.com/). A `docker-compose.yml` is provided to simplify deploy using [Docker Compose](https://docs.docker.com/compose/) utility.

The application is composed by 3 containers based on images hosted by [Github Packages](https://github.com/features/packages): https://github.com/ondata/taskforse.it/packages.
- [app:latest](https://github.com/ondata/taskforse.it/packages/233171): nextjs application
- [proxy:latest](https://github.com/ondata/taskforse.it/packages/233169): nginx reverse proxy with caching
- [osa:latest](https://github.com/ondata/taskforse.it/packages/233918): swagger ui for API documentation

You can simply copy and paste the [docker-compose.yml file](https://github.com/ondata/taskforse.it/blob/master/docker-compose.yml) provided and run `docker-compose up`. Then you can open `http://localhost:8080` using your favourite browser.

Additionally you can host also the Elasticsearch database with Kibana enabled.

You can set environment variables using a `.env` file:
- ES_SCHEME - Scheme of elasticsearch instance, default: `http`
- ES_HOST - Host of elasticsearch instance, default: `es01`
- ES_PORT - Port of elasticsearch instance, default: `9200`
- ES_INDEX_PREFIX - Prefix of elasticsearch indices, default: `appaltipop`
- ES_AUTH_USERNAME - Username for basic auth of elasticsearch instance, default: empty value
- ES_AUTH_PASSWORD - Password for basic auth of elasticsearch instance, default: empty value
- APP_URL - URL of nextjs application, default: `http://app:3000`
- OAS_URL - URL of swagger ui service, default: `http://oas-ui:8080`
- PROD_PORT - Port exposed on host, default: `8080`

### Development

If you want to contribute to the development, you can fork and clone this repository, make your changes and finally send a pull request.

NextJS is a node application, so after cloning you must install dependencies running `npm install`.

Main dependencies:
- [Material-UI](https://material-ui.com/)
- [ElasticsearchJS](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
- [Axios](https://github.com/axios/axios)
- [Lodash](https://lodash.com/)
- [NextJS](https://nextjs.org/)
- [React](https://reactjs.org/)

You can start development server with hot reloading running `npm run dev`. You can also test the production instance running `npm run start`. Then you can open `http://localhost:3000` using your favourite browser. Note you must have access to a running instance of Elasticsearch outside the containers.

### API

All data are available on a REST API (only GET verb is supported): https://www.appaltipop.it/api/v1. There is also an interactive documentation powered by [Swagger UI](https://swagger.io/tools/swagger-ui/) and compliant to [OpenAPI Specification v3](http://spec.openapis.org/oas/v3.0.3).

If you want to contribute to the API documentation, you can run [Swagger Editor](https://swagger.io/tools/swagger-editor/) using the docker-compose.yml file in `oas/` folder.

> Warning: [CORS](https://developer.mozilla.org/it/docs/Web/HTTP/CORS) is disabled by default for all origins, if you need to access API from a client-side application feel free to open an issue.

## License

The source code is released under the [MIT License](https://opensource.org/licenses/MIT).

The database is released under the [Creative Commons Attribution License](https://creativecommons.org/licenses/by/4.0/deed.it).
