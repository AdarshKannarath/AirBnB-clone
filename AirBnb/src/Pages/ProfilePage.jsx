import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../Components/AccountNav";

function ProfilePage() {
    const [redirect, setRedirect] = useState(null);
    const { ready, user, setUser } = useContext(UserContext);
    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout() {
        try {
            await axios.post('/logout', {}, { withCredentials: true });
            setRedirect('/');
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed. Please try again.');
        }
    }


    if (!ready) {
        return 'Loading...';
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }



    return (
        <div>
            <AccountNav />
            {subpage === 'profile' && (
                <div className="text-center mx-auto max-w-lg">
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logout} className="primary mt-2 max-w-sm">Logout</button>
                </div>
            )}

            {subpage === 'places' && (
                <PlacesPage />
            )}
        </div>
    );
}

export default ProfilePage;
