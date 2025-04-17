import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../components/Loader";
import { Modal } from "react-bootstrap"; 

function Article() {
  const navigate = useNavigate();
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null); 

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/login/articles")
      .then((res) => {
        setArticle(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  const handleArticleClick = (article) => {
    setSelectedArticle(article); 
  };

  const handleCloseModal = () => {
    setSelectedArticle(null); 
  };

  return (
    <div
      className="container"
      style={{
        backgroundColor: "#2E4053",
        opacity: "0.9",
        minHeight: "100vh",
        padding: "20px",
        color: "white",
      }}
    >
      <h1 className="text-center mb-4">Articles</h1>

      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-danger"
          style={{
            padding: "10px 20px",
            borderRadius: "50px",
          }}
          onClick={() => navigate("/home/addarticle")}
        >
          Add Article
        </button>
      </div>

      <div className="row">
        {article.length > 0 ? (
          article.map((item) => (
            <div className="col-12" style={{ marginTop: "2rem" }} key={item.id}>
              <div className="card" style={{ backgroundColor: "#a2b7be" }}>
                <div className="card-body">
                  <h5 className="card-title">Title of the Article : {item.title}</h5>
                  <p className="card-text">
                    {item.article_content.length > 100
                      ? item.article_content.substring(0, 100) + "..." 
                      : item.article_content}
                  </p>
                  <button
                    className="cursor-pointer"
                    onClick={() => handleArticleClick(item)}
                  >
                    Read More
                  </button>
                  <div>
                    <span>
                      <b>Created By :</b> {item.name}
                    </span>
                    <span>
                      <b> & Created At :</b> {item.created_at}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No articles found.</p>
          </div>
        )}
      </div>

   
      <Modal show={selectedArticle !== null} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedArticle?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedArticle?.article_content}</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Article;