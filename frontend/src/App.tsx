import { useAuthContext } from "@asgardeo/auth-react";

function App() {
  const { state, signIn, signOut } = useAuthContext();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">IdentySafe - Digital Locker</h1>
      
      {state.isAuthenticated ? (
        <div className="bg-white p-8 rounded shadow-md text-center">
          <p className="mb-4 text-green-600">සාර්ථකව ලොග් වී ඇත!</p>
          <p className="font-semibold">{state.username}</p>
          <button 
            onClick={() => signOut()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <button 
          onClick={() => signIn()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        >
          Login with Asgardeo
        </button>
      )}
    </div>
  );
}

export default App;