
# TypeScript Task List Backend

A simple tasklist backend created in TypeScript, GraphQL and Sequelize




## Run Locally

Clone the project

```bash
  git clone https://github.com/SamHoque/typescript-tasklist-backend
```

Go to the project directory

```bash
  cd typescript-tasklist-backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file, you may copy the .env.dist file

`DB_HOST`

`DB_PORT`

`DB_USER`

`DB_PASSWORD`

`DB_NAME`

`DB_NAME_TEST`

`DB_LOGGING`
## Example Queries

#### Get all lists and their tasks

```graphql
query {
  lists {
    id
    title
    order
    getTasks {
      id
      title
      order
      status
    }
  }
}
```
##

#### Add a new list item

```graphql
mutation AddList($title: String!) {
  createList(title: $title) {
    id
    title
    order
  }
}
```

#### AddList("Hello World")

##

#### Delete List

```graphql
mutation DeleteList($id: Float!) {
  deleteList(id: $id)
}
```
#### DeleteList(1)

#


#### Add a task to a list

```graphql
mutation AddTask($title: String!, $listId: Float!) {
  createTask(title: $title, listId: $listId) {
    id
    title
    order
    status
  }
}
```

#### AddTask("Hello World", listId)

##

#### Delete a task

```graphql
mutation DeleteTask($id: Float!) {
  deleteTask(id: $id)
}
```

#### DeleteTask(taskId)

##

#### Update a task

```graphql
mutation UpdateTask($id: Float!, $order: Float!) {
  updateTask(id: $id, order: $order) {
    id
    title
    order
    status
  }
}
```

#### UpdateTask(taskId, taskPosition)

##

#### Update a list

```graphql
mutation UpdateList($id: Float!, $title: String!) {
  updateList(id: $id, title: $title) {
    id
    title
    order
  }
}
```

#### UpdateList(listId, "Bye World")

##
## Authors

- [@SamHoque](https://github.com/SamHoque)

