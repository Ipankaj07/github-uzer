import axios from "axios";
import { useState } from "react";
import { BsTwitter } from "react-icons/bs";
import { SiBiolink, SiGithub } from "react-icons/si";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);


  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const getGithubUserData = async (search) => {
    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `token ${import.meta.env.VITE_APP_GITHUB_ACCESS_TOKEN}`,
        },
      };

      const { data: { items } } = await axios.get(
        `https://api.github.com/search/users?q=${search}`,
        config
      );

      const usersData = await Promise.all(
        items.map(async (user) =>
          await axios.get(user.url, config).then(({ data }) => data)
        )
      );

      setResults(usersData);
    } catch (error) {
      console.error("Error fetching GitHub user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    getGithubUserData(search);
  };

  return (
    <div className="app-shell bg-[#FFFBEA] text-[#3D3B2F] font-sans px-4 sm:px-6 lg:px-8" style={{ fontFamily: "'Ubuntu', Arial, sans-serif" }}>
      <div className="pt-8 pb-4 sm:pt-10 sm:pb-5 text-center">
        <img
          className="mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 border-[#000] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub Logo"
        />
        <div className="mt-5 sm:mt-6 bg-gradient-to-r from-[#FFDAB9] to-[#FF6347] bg-clip-text text-transparent text-center">
          <span className="font-bold text-3xl sm:text-4xl">GitHub Uzer</span>
          <p className="text-sm sm:text-base mt-2 text-gray-800">Search for your favorite GitHub users below!</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="text-center max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 items-stretch sm:items-center p-2">
          <input
            type="text"
            value={search}
            onChange={handleChange}
            placeholder="Ex: octocat"
            className="bg-[#FFE5E5] border-[3px] border-black px-3 py-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] w-full sm:flex-1 sm:max-w-2xl focus:outline-none"
          />

          <button
            type="submit"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-11 bg-[#90EE90] hover:bg-[#7CDF7C] text-black font-bold px-6 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto"
          >
            Search
          </button>
        </div>
      </form>

      <div className="results-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 py-4 sm:py-6 w-full max-w-7xl mx-auto">
        {loading && (
          <div className="col-span-full flex justify-center py-6">
            <div className="loader border-8 border-gray-300 border-t-gray-500 rounded-full w-16 h-16 animate-spin"></div>
          </div>
        )}

        {hasSearched && results.length === 0 && !loading && (
          <div className="flex justify-center col-span-full text-gray-600 font-bold h-32 items-center">
            No results found. Please try again.
          </div>
        )}

        {results.length !== 0 && !loading ? (
          results.map((result) => (
            <div key={result.id} className="bg-card text-card-foreground p-3 sm:p-4 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full">
              <img
                src={result.avatar_url}
                alt={result.login}
                className="w-full h-52 sm:h-60 lg:h-64 object-cover mb-3 border-2 border-black"
              />
              <p className="text-lg font-bold mt-4 text-center">
                {result.name || result.login}
              </p>
              <p className="text-sm text-gray-600 text-center mt-2 break-words">
                {result.bio || "No bio available"}
              </p>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {result.twitter_username && (
                  <a
                    href={`https://twitter.com/${result.twitter_username}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <BsTwitter className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-pink-500 hover:text-white bg-[#FFB6C1] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-2 h-10 w-10"
                    />
                  </a>
                )}
                {result.blog && (
                  <a href={result.blog} target="_blank" rel="noreferrer">
                    <SiBiolink className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-purple-500 hover:text-white bg-[#E6E6FA] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-2 h-10 w-10"
                    />
                  </a>
                )}
                <a
                  href={result.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-purple-300 hover:text-white bg-[#D8B7DD] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-2 h-10 w-10"

                >
                  <SiGithub />
                </a>
              </div>
              {result.location && (
                <p className="mt-4 text-sm text-gray-600 text-center break-words">
                  <strong>Location:</strong> {result.location}
                </p>
              )}
              {result.company && (
                <p className="mt-2 text-sm text-gray-600 text-center break-words">
                  <strong>Company:</strong> {result.company}
                </p>
              )}
            </div>
          ))
        ) : null}
      </div>

      <footer className="text-center pt-2 pb-5 text-gray-600 w-full max-w-7xl mx-auto">
        <p className="bg-[#FFDAB9] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black p-2 text-sm sm:text-base">
          Made with ❤️ by{" "}
          <a href="https://github.com/ipankaj07" target="_blank" rel="noreferrer" className="text-blue-500">
            Pankaj Raj
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;