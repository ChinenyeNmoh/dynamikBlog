import Hero from "../components/Hero"
import ViewAll from "../components/ViewAll"
import AllPost from "../components/AllPost"

const HomeScreen = () => {
  return (
    <div >
        <Hero />
        <AllPost isHome={true} />  
        <ViewAll /> 
    </div>
  )
}

export default HomeScreen