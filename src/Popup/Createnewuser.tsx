import react from 'react';
import axios from 'axios';
interface Newuserinfo  {
  username: string;
  email: string;
  mobile: string;
  role: string;
  age: number;
  profileImage: string;
  designation: string;
  experience: string;
  location: string; 
}

interface props {
  onClose: () => void;
}

const CreateUserPopup: React.FC<props> = ({onClose }) => {

    const [newUser, setNewUser] = react.useState<Newuserinfo>({
    username: "",
    email: "",
    mobile: "",
    role: "",
    age: 0,
    profileImage: "",
    designation: "",
    experience: "",
    location: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: name === "age" ? Number(value) : value }));
  }

  const onSubmit = async (user: Newuserinfo) => {
    try{
      const  payload={
        servicename: "CreateNewUser",
        JsonValue: {
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        age: user.age,  
        profileImage: user.profileImage,
        designation: user.designation,
        experience: user.experience,
        location: user.location,
        },
      };
      console.log("email:", user.email);
      const response = await axios.post("http://localhost:5000/api/common", payload);
      console.log("User created successfully:", response.data.data[0]);
      
      alert("✅ User Created Successfully");
        }catch(error){
      console.log("Error creating user:", error);           
        }
    }




  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h3>New User Creation</h3>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={onChange}
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={onChange}
          style={styles.input}
        />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile No"
          value={newUser.mobile}
          onChange={onChange}
          style={styles.input}
        />

        <select
          name="role"
          value={newUser.role}
          onChange={onChange}
          style={styles.input}
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
          <option value="Moderator">Moderator</option>
        </select>
        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={newUser.experience}
          onChange={onChange}
          style={styles.input}
        />
        <input
          type="text"
          name="age"
          placeholder="Age"
          value={newUser.age}
          onChange={onChange}
          style={styles.input}
        />

        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={newUser.designation}
          onChange={onChange}
          style={styles.input}
        />
         <input
          type="text"
          name="location"
          placeholder="Location"
          value={newUser.location}
          onChange={onChange}
          style={styles.input}
        />

        <div style={{ marginTop: "14px" }}>
          <button onClick={() => onSubmit(newUser)} style={styles.saveButton}>Save User</button>
          <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
    justifyContent: "center", alignItems: "center", zIndex: 999,
  },
  modal: {
    background: "#fff", padding: "25px", borderRadius: "10px",
    width: "400px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
  },
  input: {
    display: "block", width: "100%", margin: "8px 0",
    padding: "8px", borderRadius: "5px", border: "1px solid #ccc",
  },
  saveButton: {
    background: "#28a745", color: "#fff", border: "none",
    padding: "8px 12px", borderRadius: "6px", cursor: "pointer",
    marginRight: "10px"
  },
  cancelButton: {
    background: "#6c757d", color: "#fff", border: "none",
    padding: "8px 12px", borderRadius: "6px", cursor: "pointer",
  },
};

export default CreateUserPopup;

