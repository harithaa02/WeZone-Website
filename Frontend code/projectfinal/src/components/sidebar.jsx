import { Link } from "react-router";
import gait from '../assets/img/Gait.png';
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import './Sidebar.css';
import { FaHome } from "react-icons/fa";
import { LiaRunningSolid } from "react-icons/lia";
import { MdOutlinePoll } from "react-icons/md";
import { RiArticleLine } from "react-icons/ri";
import { RiAdminFill } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import session from '../assets/img/presentation.png';
function Sidebar(){
  
    return(
        <div className="sidebar">
          <img src={gait} alt="logo"  className="image"/>
            <ul>
                <li>
                    <Link to={'dashboard'}> <FaHome /> Dashboard</Link>
                </li>
                <li>
                    <Link to={'birthdays'}> <LiaBirthdayCakeSolid  />Birthday</Link>
                </li>
                <li>
                    <Link to={'sports'}> <LiaRunningSolid />  Sports</Link>
                </li>
                <li>
                    <Link to={'sessions'}> <img src={session} className="image1" />Session</Link>
                </li>
                <li>
                    <Link to={'polls'}>  <MdOutlinePoll />Polls</Link>
                </li>
                <li>
                    <Link to={'article'}> <RiArticleLine />Article</Link>
                </li>
                <li>
                    <Link to={'shootout'}>Shootout</Link>
                </li>
                <li>
                    <Link to={'Admin'}> <RiAdminFill /> Admin</Link>
                </li>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <li>
                    <Link to={'logout'}> <IoIosLogOut />LogOut</Link>
                </li>
            </ul>
        </div>
    )
}
export default Sidebar;
