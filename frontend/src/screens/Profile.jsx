import React,{useEffect,useState} from 'react'
import '../css/Profile.css'
import PostDetails from '../components/PostDetails'
import ProfilePic from '../components/ProfilePic'
function Profile() {

  var picLink="https://cdn-icons-png.flaticon.com/128/3177/3177440.png" 
  const [pic, setPic] = useState([])
  const [show, setShow] = useState(false)
  const [posts, setPosts] = useState([])
  const [changePic, setChangePic] = useState(false)
  const [user, setUser] = useState("")

  const toggleDetails=(posts)=>{
    if(show){
      setShow(false)
      // console.log("hide");
    }
    else{
      setShow(true)
      setPosts(posts)
      // console.log(item)
      // console.log("show");
    }
  }


  const changeprofile=()=>{
    if(changePic)
    {
      setChangePic(false)
    }
    else
    {
      setChangePic(true)
    }
  }

  useEffect(() => {
    fetch(`https://instagram-clone-fui8.onrender.com/user/${JSON.parse(localStorage.getItem("user"))._id}`,{
      headers:{
        Authorization:"Bearer "+localStorage.getItem("jwt")
      }
    })
    .then(res=>res.json())
    .then((result)=>{
      console.log(result)
      setPic(result.posts)
      setUser(result.user)
      console.log(pic)
    })
  }, [])
  
  return (
    <div className='profile'>
      {/* Profile frame */}
      <div className="profile-frame">

        {/* profile pic */}
        <div className="profile-pic">
          <img 
          onClick={changeprofile}
          src={user.photo?user.photo:picLink} alt="" />
        </div>

        {/* profile data */}
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile-info" style={{display:"flex"}}>
            <p>{pic?pic.length:"0"} post</p>
            <p>{user.followers?user.followers.length:"0"} followers</p>
            <p>{user.following?user.following.length:"0"} following</p>
          </div>
        </div>

      </div>
      <hr style={{
        width:"90%",
        margin:"auto",
        opacity:"0.8",
        margin:"25px auto",
      }} />
      {/* Gallery */}
      <div className="gallery">
        {
          pic.map((pics)=>{
            return <img key={pics._id} src={pics.photo} className='item' 
            // onClick={(=>{
            //   toggleDetails(pics)
            // })}
            onClick={()=>{
              toggleDetails(pics)
            }}
            ></img>
          })
        }
      </div>
      {show && <PostDetails item={posts} toggleDetails={toggleDetails} />}
      {
        changePic && <ProfilePic changeprofile={changeprofile} />
      }
    </div>
  )
}

export default Profile