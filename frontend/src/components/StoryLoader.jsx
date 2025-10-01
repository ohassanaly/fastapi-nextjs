import { useState, useEffect } from "react";
import {useParams, useNavigate} from "react-router-dom"
import axios from 'axios'
import LoadingStatus from "./LoadingStatus";
import StoryGame from "./StoryGame";
import {API_BASE_URL} from "../util"

function StoryLoader() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(()=> {
        loadStory(id)
    }, [id])

    const loadStory = async(storyId) => {
        setLoading(true)
        setError(null)

        try {
            const response=await axios.get(`${API_BASE_URL}/stories/${storyId}/complete`)
            setStory(response.data)
            setLoading(false)
        }
        catch (err) {
            if (err.response?.status===404){
                setError("Story is not found")            
            } else {
                setError("Failed to load story")
            }
        } finally {
            setLoading(false)
        }
    }

    const createNewStory = () => {
        navigate("/")
    }

    if (loading) {
        return <LoadingStatus theme={"story"}/>;
    }

    if (error) {
        return <div className="story-loader">
            <div className="error-message">
                <h2>Story Not found</h2>
                <p> error </p>
                <button onClick={createNewStory}> Go to story generator </button>
            </div>
        </div>
    }

    if (story){
        return <div className="story-loader">
            <StoryGame story={story} onNewStory={createNewStory}/>
        </div>
    }
}
    export default StoryLoader