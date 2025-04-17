import axios from 'axios';
import React, { useState } from 'react';
import token from '../../token';

const AddArticle = () => {
  const [formData, setFormData] = useState({
    name:'',
    title: '',
    content: '',
    Date:"",
  });
  
  const [submittedArticles, setSubmittedArticles] = useState([]);

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
  const user=token.getUser();
  const auth_key=user?.response?.auth_token;
  const headers={
      Authorization:auth_key,
      'Content-Type': 'multipart/form-data'
  }
 
    e.preventDefault();
    const payload={
      name:formData.name,
      title: formData.title,
      article_content:formData.content,
      event_date:formData.Date,
    }    
    const newArticle = JSON.stringify(payload)
    // axios.post("http://localhost:3000/Articles", newArticle);
    axios.post('http://127.0.0.1:8000/login/articles',newArticle,{headers:headers})
    setSubmittedArticles([newArticle, ...submittedArticles]);
    // setFormData({ title: '', content: '' }); 
  };

  return (
    <div className="container">
      <div className="row">
        <div className="text-center">
          <h1>Submit Article</h1>
        </div>
        <div className="col-12">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name of Creater:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter Name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title of the Article:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter title"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Date" className="form-label">
                Date:
              </label>
              <input
                type="date"
                id="Date"
                name="Date"
                className="form-control"
                value={formData.event_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">
                Your Article:
              </label>
              <textarea
                id="content"
                name="content"
                rows="10"
                className="form-control"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your article here..."
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={!formData.title || !formData.content}
            >
              Submit Article
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddArticle;