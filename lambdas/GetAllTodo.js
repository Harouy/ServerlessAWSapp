import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient();

export const handler = async (event) => {
  try {
    const todos = await getAllTodos();

    return {
      statusCode: 200,
      body: JSON.stringify(todos),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (err) {
    console.error(err);
    return errorResponse(err.message, event.requestContext.requestId);
  }
};

const getAllTodos = async () => {
  const params = {
    TableName: "todoapp",
  };
  const command = new ScanCommand(params);
  const data = await ddbClient.send(command);
  return data.Items;
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
