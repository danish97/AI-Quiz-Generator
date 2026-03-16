import UrlForm from "../components/UrlForm"

const isValidUrl = (str) =>{
  try {
    new URL(str);
    return true;
  } catch (error) {
    return false;
  } 
}


export const Home = () => {
  return (
    <div className='min-h-screen flex items-center justify-center sm:px-6 bg-hero'>
        <h1 className="text-3xl font-bold">AI Quiz Generator</h1>
        <UrlForm 

        />
    </div>
  )
}
