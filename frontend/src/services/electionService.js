import apiClient from "../api/axios";

/**

* Retrieves all elections.
*
* @returns {Promise<Object>} Paginated or non-paginated election response.
  */
  const getElections = async () => {
  const response = await apiClient.get("/elections/");

return response.data;
};

const electionService = {
getElections,
};

export default electionService;
