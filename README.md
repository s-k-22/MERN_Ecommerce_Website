## Backend
**Create backend folder**

**Initialize Node project** -> `npm init -y` -> Creates package.json to manage dependencies.<br>
Install basic packages -> `npm i express dotenv nodemon`

**Changes in package.json** <br>
`"type": "module"` -> Allows import/export (ES6 instead of commonjs require) <br>
`"start": "nodemon backend/server.js"` -> run application with `npm run start`

**Setup env variables** <br>
`dotenv.config({ path: "backend/config/config.env" });` -> to use it `process.env.VARIABLE_NAME`

**MVC way to organize code** <br>
What we want? <br>
`app.get("/path", (req,res) => { }`

How we write it in MVC?<br>
`app.use(router)` -> `router.route("/path").get(controller)` -> `export const controller = (req,res) => {}`

**Connecting backend to Database(Mongodb)** <br>
`npm i mongoose` <br>
Write function is db.js -> `mongoose.connect(URI)` and use it in server.js `connectMongoDatabase();` <br>
Work on Product Schema -> `const productSchema = new mongoose.Schema({})` -> `export default mongoose.model`

**CRUD operations on Product model**<br>
POST    → create -> req.body <br>
GET     → find <br>
PUT     → findByIdAndUpdate -> req.params.id, req.body, {new:true,runValidators:true}-> /:id <br>
DELETE  → findByIdAndDelete -> req.params.id -> /:id <br>

============================================================================================

**Backend Error Handling** <br>
Sync errors throw immediately. Async errors happen later.

Sync error  → Express catches automatically<br>
Async errors → must use try–catch or wrapAsyncError  <br>
Error middleware handles both via next(err) because Error middlware is not triggered automatically

ways to handle async errors -> try-catch, wrapasync, process.on("unhandledRejection",...) 

1.Custom Error Class + Error Middleware (err,req,res,next) <br>
📍 Works for both sync and async code  <br>
📍 keeps structure of error response consistent<br>
📍 status code is hard coded everywhere and repeated code<br>
📍 controller next(error) -> custom class instance -> errormiddleware for res.status.json -> app.use(errorMiddleware) <br>
📍 _Without Error.captureStackTrace -> lot of messages on terminal when error occurs<br>
With -> exact message where real problem is_ <br>

 `if (!product) return next(new HandleError("Product Not Found", 404));` -> If you DON’T want the rest of the function to run after errMiddleware → use return.<br>
 eg. Sending wrong id with same length (product not found)

2.WrapAsyncError Function + Error Middleware <br>
📍 Avoids try-catch in every controller <br>
eg. Handles DB validation error(missing required fields)

3.Promise Rejection Errors<br>
📍 Handles async errors that happens outside the req-res cycle. -> related to node not to HTTP-> close the server using server.close() <br>
`process.on("unhandledRejection", (err)=>{...})`
eg. Wrong DB URI 

4.Handling Exception Errors <br>
📍 Handles sync errors.<br>
`process.on("uncaughtException", (err)=>{...})`
eg. logging undefined variable

5.Handle MongoDB Errors <br>
CastError -> id of diff length

============================================================================================

utils -> in apiFunctionality.js create apiFunctionality class -> search, filter, pagination <br>
`const apiFunctionality =  await new apiFunctionality(Product.find(),req.query).search().filter()` -> query(mongoose) and queryStr(in url)<br>
_for chaining dont forget to return **this** from apiFunctinality methods._

**Search functionality** (according to name field)<br>
`Product.find({name:"product"})` -> returns products with complete name product and not keyword in name. So need to use $regex.<br>
`search()` -> `this.query.find({...keyword})` where `keyword = this.queryStr.keyword ? {name:{$regex:this.queryStr.keyword,options:"i"}} :{}` <br>

**Filter functionality** (according to category field)<br>
we're going to pass keyword, page, limit, category as query to url. we need to remove all other queries except category<br>
`filter()` -> `this.query.find(queryCopy)`

**Pagination functionality with limit and skip**<br>
we need to find which products to show acc to page number.<br>
_skip = resultsPerPage * (page -1)_ -> on page 3, skip first 6 products<br>
`this.query = this.query.limit(resultsPerPage).skip(skip)`<br>

now we need to paginate filtered projects. eg. in product category we've 4 products then only 2 pages are needed.<br>
clone the `filteredQuery = apiFunctionality.query.clone();` and then count the no of Documents using `filteredQuery.countDocuments();`<br>
totalPages = Math.ceil(noOfProducts/resultsPerPage);<br>
if(page>totalPages) then return error and then call pagination using `apiFunctionality.pagination(3)`

============================================================================================

