import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Modal, FormSelect, OverlayTrigger, Popover } from "react-bootstrap";
import moment from "moment";
import { connect, useDispatch, useSelector } from "react-redux";
import { fetchData } from "../Redux/actions";
const Users = () => {
  //use dipatch() to call an redux action
  const dispatch = useDispatch();
  // perviously know as useHistory to navigate between pages
  const navigate = useNavigate();
  //states for data store
  const [show, setShow] = useState(false);
  const [otherInput, setOtherInput] = useState(false);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState({
    collegeName: "",
    name: "",
    birthDate: "",
    hobby: [],
    address: "",
    gender: "",
    otherHobby: "",
  });
  const [showSuccess, setSuccess] = useState({ msg: "", show: false });
  const [dataKey, setKey] = useState(null);
  useEffect(() => {
    //this will trigger redux action for data fetching with api
    dispatch(fetchData());
  }, [showSuccess.show, dispatch]);
  const onChangeCollege = (e) => {
    //this api will only trigger when the input characters are more than 3 because it will fetch more than 1000 of data if we add less than 3 which will affect page speed and user expereince
    if (e.target.value.length >= 3) {
      var array = [];
      fetch("http://universities.hipolabs.com/search?name=" + e.target.value, {
        method: "GET",
        mode: "cors",
      })
        .then((response) => response.json())
        .then((data) => {
          data.forEach((college) => {
            array.push(college.name);
          });
          setData(array);
        })
        .catch((err) => console.log(err));
    }
  };
  const clearState = () => {
    setAllData({
      collegeName: "",
      name: "",
      birthDate: "",
      hobby: [],
      address: "",
      gender: "",
      otherHobby: "",
    });
  };
  const postData = (values) => {
    //if a key is there it will update the data of that specific key otherwise it will create a new key for new data

    if (dataKey) {
      // for updating existing data
      fetch(
        `https://assignment-ff008-default-rtdb.firebaseio.com/alldata/students/${dataKey}.json`,
        {
          method: "PUT",
          body: JSON.stringify(values),
        }
      )
        .then((response) =>
          response.json().then((data) => {
            //response handling
            if (response.status === 200) {
              setShow(false);
              clearState();
              setSuccess({
                msg: "Student is updated listed!",
                show: true,
              });
            } else {
              setSuccess({
                msg: "Something went wrong! please try again.",
                show: true,
              });
            }
          })
        )
        .catch((err) => console.log(err));
    } else {
      // to add new data
      fetch(
        `https://assignment-ff008-default-rtdb.firebaseio.com/alldata/students/.json`,
        {
          method: "POST",
          body: JSON.stringify(values),
        }
      )
        .then((response) =>
          response.json().then((data) => {
            //response handling
            if (response.status === 200) {
              setShow(false);

              setSuccess({
                msg: "Student is successfully listed!",
                show: true,
              });
              clearState();
            } else {
              setSuccess({
                msg: "Something went wrong! please try again.",
                show: true,
              });
            }
          })
        )
        .catch((err) => console.log(err));
    }
  };
  const fillForm = () => {
    clearState();
    setKey(null);
    setShow(true);
  };
  const onEdit = (item, keys) => {
    // setalldata will reinitialize existing values for formik
    setAllData(item);
    setShow(true);
    setKey(keys);
  };
  const viewListing = (key) => {
    // dont forget to pass key while calling this function
    navigate("/viewuser?" + key);
  };
  //store required data inside listings from redux store
  const listings = useSelector((store) => store.data?.alldata.students || {});
  const onDelete = (key) => {
    fetch(
      `https://assignment-ff008-default-rtdb.firebaseio.com/alldata/students/${key}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data === null) {
          setSuccess({ msg: "Data successfully deleted!", show: true });
        }
      })
      .catch((err) => console.log(err));
  };

  // page will be in loading state untill listing data is loaded from redux store
  return listings === undefined ? (
    <h4>loading....</h4>
  ) : (
    <React.Fragment>
      <div className="container my-5">
        {/* <div className="header text-center ">
          <h3>Student Management System</h3>
        </div> */}
        <div className="mt-3 ml-auto" id="modalButtonArea">
          <button className="btn btn-primary" onClick={() => fillForm()}>
            Add User
          </button>
        </div>

        <div id="list" className="mt-5">
          <h3 className="display-4">Students Data</h3>
          <div className="row">
            {Object.keys(listings).length !== 0 ? (
              Object.keys(listings)
                .reverse()
                .map((listing) => (
                  <div className="col-md-6" key={listing}>
                    <div className="card mt-3 listCard">
                      <div className="card-body">
                        <h5 className="card-title">{listings[listing].name}</h5>
                        <div className="row">
                          <div className="col">
                            <p className="card-text">
                              Address:{listings[listing].address}
                            </p>
                            <p className="card-text">
                              College Name:{listings[listing].collegeName}
                            </p>
                          </div>
                          <div className="col-5">
                            <button
                              className="btn btn-primary "
                              onClick={() => onEdit(listings[listing], listing)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-success mx-3"
                              onClick={() => viewListing(listing)}
                            >
                              View
                            </button>
                            <OverlayTrigger
                              trigger="focus"
                              placement="right"
                              overlay={
                                <Popover>
                                  <div className="p-4">
                                    <p>Are You sure?</p>
                                    <button
                                      className="btn btn-success "
                                      style={{ marginRight: "10px" }}
                                      onClick={() => onDelete(listing)}
                                    >
                                      yes
                                    </button>
                                    <button className="btn btn-warning">
                                      no
                                    </button>
                                  </div>
                                </Popover>
                              }
                            >
                              <button className="btn btn-danger">Delete</button>
                            </OverlayTrigger>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="card p-3 mx-auto" id="noDataCard">
                <h6>No Students data available</h6>
              </div>
            )}
          </div>
        </div>
      </div>
      {/*1) Formik is a library which will help us to easily validate inputs and show errors
      2) You need to pass any event with handlechange inside formik
      3)dont forget to enable reinitialize for updating initial values for edit */}
      <Formik
        enableReinitialize
        initialValues={allData}
        onSubmit={(values, { setSubmitting }) => {
          postData(values);
          setSubmitting(false);
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("Required"),
          birthDate: Yup.date().required("Required."),
          address: Yup.string().required("Required."),
          collegeName: Yup.string().required("Required."),
          gender: Yup.string().required("Required."),
          hobby: Yup.array().required("Required"),
        })}
      >
        {({
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Modal centered show={show} onHide={() => setShow(false)}>
            <Modal.Header>
              <span className="ml-auto" onClick={() => setShow(false)}>
                <i className="fas fa-times " />
              </span>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    (errors.name && touched.name && "error form-control") ||
                    "form-control"
                  }
                  type="text"
                  id="name"
                  value={values.name}
                  placeholder="Enter your name"
                />
                {errors.name && touched.name && (
                  <div className="input-feedback">{errors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="name">Birth Date</label>
                <input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.birthDate}
                  className={
                    (errors.birthDate &&
                      touched.birthDate &&
                      "error form-control") ||
                    "form-control"
                  }
                  type="date"
                  id="birthDate"
                  max={moment().format("YYYY-MM-DD")}
                />
                {errors.birthDate && touched.birthDate && (
                  <div className="input-feedback">{errors.birthDate}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  onChange={handleChange}
                  value={values.address}
                  onBlur={handleBlur}
                  className={
                    (errors.address &&
                      touched.address &&
                      "error form-control") ||
                    "form-control"
                  }
                  placeholder="Enter your address"
                />
                {errors.address && touched.address && (
                  <div className="input-feedback">{errors.address}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="select">Select Your Gender</label>
                <FormSelect
                  placeholder="Select"
                  id="gender"
                  name="gender"
                  value={values.gender || "select"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    (errors.gender && touched.gender && "error form-control") ||
                    "form-control"
                  }
                >
                  <option>Select</option> <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </FormSelect>
                {errors.gender && touched.gender && (
                  <div className="input-feedback">{errors.gender}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="collegeName">College Name</label>
                <div>
                  <input
                    type="text"
                    id="collegeName"
                    placeholder="Enter your colege name"
                    onChange={(e) => onChangeCollege(e)}
                    onInput={handleChange}
                    value={values.collegeName}
                    list="datalist"
                    onBlur={handleBlur}
                    className={
                      (errors.collegeName &&
                        touched.collegeName &&
                        "error form-control") ||
                      "form-control"
                    }
                  />
                </div>
                <datalist id="datalist">
                  {data.map((college, index) => (
                    <option value={college} key={index}>
                      {college}
                    </option>
                  ))}
                </datalist>

                {errors.collegeName && touched.collegeName && (
                  <div className="input-feedback">{errors.collegeName}</div>
                )}
              </div>
              <div className=" mt-2 checkboxes">
                <label>Select your hobbies</label>
                <div className="form-group">
                  <input
                    name="hobby"
                    type="checkbox"
                    onChange={handleChange}
                    value="Reading"
                    checked={values?.hobby?.includes("Reading")}
                    className="form-check-input"
                  />
                  <label htmlFor="Reading">Reading</label>
                  <input
                    type="checkbox"
                    value="Gaming"
                    checked={values?.hobby?.includes("Gaming")}
                    onChange={handleChange}
                    className="form-check-input"
                    name="hobby"
                  />
                  <label htmlFor="Gaming">Gaming</label>
                  <input
                    name="hobby"
                    type="checkbox"
                    onChange={handleChange}
                    value="Traveling"
                    checked={values?.hobby?.includes("Traveling")}
                    className="form-check-input"
                  />
                  <label htmlFor="Traveling">Traveling</label>
                  <input
                    name="hobby"
                    type="checkbox"
                    onChange={handleChange}
                    value="Drawing"
                    checked={values?.hobby?.includes("Drawing")}
                    className="form-check-input"
                  />
                  <label htmlFor="Drawing">Drawing</label>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="Other"
                    onChange={() => setOtherInput(!otherInput)}
                    checked={
                      values.otherHobby !== "" || otherInput ? true : false
                    }
                  />
                  <label htmlFor="Other">Other</label>
                  {otherInput || values.otherHobby !== "" ? (
                    <input
                      className="form-control mt-2"
                      onChange={handleChange}
                      id="otherHobby"
                      value={values.otherHobby}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="form-group mt-3 text-center">
                <button
                  className="btn btn-success"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </Formik>
      <Modal centered show={showSuccess.show}>
        <Modal.Body>
          <div>
            <h4>{showSuccess.msg}</h4>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {" "}
          <button
            className=" btn btn-success"
            onClick={() => setSuccess({ msg: "", show: false })}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};
// redux state
const mapStateToProps = (state) => ({
  state,
});
export default connect(mapStateToProps, { fetchData })(Users);
