import {
  DynamoDBClient,
  UpdateItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient();

export const handler = async (event) => {
  const toDoId = event.pathParameters.todoId;
  console.log("Received event for toDoId: ", toDoId);
  const requestBody = JSON.parse(event.body);
  const { Title, IsComplete } = requestBody;
  console.log(Title);
  try {
    const currentItem = await getTodoById(toDoId);

    if (!currentItem) {
      console.log("2");
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Todo item not found",
        }),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

    await updateTodoIsComplete(toDoId, IsComplete, Title);
    console.log("2");

    return {
      statusCode: 200,
      body: JSON.stringify({
        todoId: toDoId,
        IsComplete: IsComplete,
        Title: Title,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (err) {
    console.error(err);
    return errorResponse(err.message, event.requestContext.requestId);
  }
};

const getTodoById = async (todoId) => {
  const params = {
    TableName: "todoapp",
    Key: {
      todoId: { N: todoId.toString() }, // DynamoDB expects the number as a string
    },
  };
  try {
    console.log("4");
    const command = new GetItemCommand(params);
    const data = await ddbClient.send(command);
    console.log();

    return data.Item || null; // Return null if data.Item is undefined
  } catch (error) {
    console.error("Error fetching todo:", error);
    throw error;
  }
};

const updateTodoIsComplete = async (todoId, isComplete, Title) => {
  console.log("5");
  const params = {
    TableName: "todoapp",
    Key: {
      todoId: { N: todoId.toString() }, // DynamoDB expects the number as a string
    },
    UpdateExpression: "SET IsComplete = :IsComplete, Title = :Title", // Use a comma to separate attributes
    ExpressionAttributeValues: {
      ":IsComplete": { BOOL: isComplete },
      ":Title": { S: Title }, // Corrected the type to S for String
    },
    ReturnValues: "UPDATED_NEW",
  };
  const command = new UpdateItemCommand(params);
  await ddbClient.send(command);
};

const errorResponse = (errorMessage, awsRequestId) => {
  return {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
