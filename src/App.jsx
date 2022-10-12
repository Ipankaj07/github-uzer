import { useState } from "react";
import axios from "axios";
import { BsTwitter } from "react-icons/bs";
import { SiBiolink, SiGithub } from "react-icons/si";

function App() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const getuserData = async (search) => {
    const {
      data: { items },
    } = await axios.get(`https://api.github.com/search/users?q=${search}`);

    const usersData = await Promise.all(
      items.map(async (user) => {
        const { data } = await axios.get(user.url);
        return data;
      })
    );

    setResults(usersData);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    getuserData(search);
  };

  return (
    <>
      <div className="container mx-auto font-sans">
        <div className="mb-4">
          <img
            className="mx-auto h-20 w-20 "
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="github logo"
          />
          <p className="text-center text-2xl font-bold">Github User Search</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center"
        >
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <input
              type="text"
              value={search}
              onChange={handleChange}
              placeholder="Search for user's"
              className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-base focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-4 items-center justify-center p-2">
          {loading ? (
            <div className="flex items-center justify-center mt-4">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12 mb-4"></div>
            </div>
          ) : (
            results.map((result) => (
              <div
                key={result.id}
                className=" bg-white shadow-md rounded-lg overflow-hidden w-96 max-w-sm my-4 mx-2 mt-10 p-4"
              >
                <img
                  src={result.avatar_url}
                  alt={result.login}
                  className="w-full h-56 object-scale-down object-center"
                />
                <p className="text-center font-bold text-xl my-3">
                  {result.name ? result.name : result.login}
                </p>
                <p className="text-center text-gray-500 text-sm mb-3.5">
                  {result.bio ? result.bio : "No Bio"}
                </p>
                <div className="flex items-center justify-evenly my-3">
                  {result.twitter_username && (
                    <a
                      href={`https://twitter.com/${result.twitter_username}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <BsTwitter className="text-2xl" />
                    </a>
                  )}
                  {result.blog && (
                    <a href={result.blog} target="_blank" rel="noreferrer">
                      <SiBiolink className="text-2xl" />
                    </a>
                  )}
                  <a
                    href={result.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-2xl"
                  >
                    <SiGithub />
                  </a>
                </div>

                <div className="flex flex-col gap-2 my-3 mt-4">
                  {result.company && (
                    <p className="text-center text-gray-500 text-sm">
                      <span className="font-bold">Company:</span>
                      {result.company}
                    </p>
                  )}
                  {result.location && (
                    <p className="text-center text-gray-500 text-sm">
                      <span className="font-bold">Location:</span>
                      {result.location}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;