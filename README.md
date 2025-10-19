# 🎬 **Movies Dataset Web API**

> **University of Washington Tacoma**  
> **School of Engineering and Technology**  
> **Computer Science and Systems**  
> **TCSS 460 A – Client/Server Programming for Internet Applications**  
> **Autumn 2025**  
> **Instructor:** Professor Charles Bryan  
>
> **Team Members:**  
> - Ryder DeBack  
> - Faisal Nur  
> - Kevin Nam Hoang  
> - Mutahar Wafayee  

---

## 📚 **Project Overview**

The **Movies Dataset Web API** is a group project for **TCSS 460**, focused on developing a RESTful API using **Node.js** and **Express.js**.  
This API will allow users to interact with a movies dataset — retrieving, adding, updating, and deleting movie records.  

The dataset contains information such as **titles, genres, release years, directors, and ratings**, making it ideal for practicing full-stack API development concepts.  

All diagrams, scripts, and planning documents are located in the `/project_files` directory.

---

## 🧩 **Alpha Sprint Contribution**

| **Team Member** | **Contribution** |
|------------------|------------------|
| **Ryder DeBack** | Created the GitHub repository, built the ER diagram, and developed the Swagger YAML file that documents the proposed endpoints and operations. |
| **Faisal Nur** | Authored the planning document outlining the Web API’s functionality, written for a non-technical audience, describing how the API interacts with the dataset. |
| **Kevin Nam Hoang** | Researched and prepared the **cloud hosting options** document for Node.js/Express with PostgreSQL. Compared **Heroku** and **Render**, tested both using the HelloWorld API, and summarized pros and cons. |
| **Mutahar Wafayee** | Wrote and organized the main `README.md` file, consolidating all deliverables and summarizing team progress for the Alpha Sprint submission. |

---

## 💬 **Alpha Sprint Meetings**

Our group coordinated primarily through **Discord**, using a shared project channel for scheduling, discussion, and file sharing.  

- Ryder created the GitHub repository and first meeting documentation.  
- Kevin proposed the use of **online meetings** since multiple members were remote.  
- The team agreed to meet **Friday mornings** for progress discussions and updates.  
- Files and drafts (ER diagram, hosting document, Swagger YAML, and project plan) were shared directly in Discord before being uploaded to GitHub.  

This communication style helped the team stay organized and transparent about who was working on each task.

---

## 📝 **Alpha Sprint Comments**

- The **GitHub repository** (`RyderDProgrammer/TCSS460-MovieWebAPI`) was created and shared with all collaborators.  
- The **movies dataset** was reviewed, and key entities identified for the ER diagram.  
- **Swagger YAML** was generated to outline endpoints for retrieving and managing movies.  
- **Hosting options** were explored, and both **Heroku** and **Render** were tested using the HelloWorld API.  
- The **planning document** was completed using AI-assisted writing and refined by the group.  
- The **SQL initialization script** is being developed to define tables and load data from the CSV dataset.  

---

## ☁️ **Cloud Hosting Summary**

The group explored two cloud platforms for hosting a Node.js/Express API with PostgreSQL integration. Both options were tested with the HelloWorld API.

| **Platform** | **Highlights** | **Pros** | **Cons** |
|---------------|----------------|-----------|-----------|
| **Heroku** | Git-based deployment, PostgreSQL add-on, automatic SSL, free GitHub credits | Easy setup, student credits, built-in DB | Free apps sleep after inactivity |
| **Render** | Always-on free tier, PostgreSQL service, auto-deploy from GitHub | No sleeping apps, simple UI, free SSL | Slightly slower build times |

✅ **Recommendation:** *Render* is preferred for continuous hosting and demonstrations, while *Heroku* remains great for fast setup using GitHub Student Pack credits.  
Full comparison and test documentation can be found in `/project_files/cloud-hosting-options.md`.

---

## ⚙️ **Planned API Functionality**

| **HTTP Method** | **Endpoint** | **Description** |
|-----------------|---------------|-----------------|
| `GET` | `/movies` | Retrieve all movies |
| `GET` | `/movies/:id` | Retrieve a movie by ID |
| `POST` | `/movies` | Add a new movie |
| `PUT` | `/movies/:id` | Update existing movie details |
| `DELETE` | `/movies/:id` | Delete a movie record |

Each route will return JSON responses and include proper error handling.

---

## 📁 **Project Structure**

```
Movies-Dataset-WebAPI/
│
├── /project_files
│   ├── planning_document.pdf          # Non-technical project overview
│   ├── er_diagram.png                 # Entity-Relationship diagram
│   ├── init_script.sql                # SQL table creation and dataset import
│   ├── cloud-hosting-options.md       # Hosting comparison and tests
│   ├── swagger.yaml                   # API design documentation
│
├── README.md                          # This file
└── .gitignore
```

---

## 🧠 **Learning Objectives**

By completing this project, students will:
- Learn to design RESTful APIs using Express.js  
- Understand database design and SQL scripting through ER diagrams  
- Use Swagger for documenting and testing endpoints  
- Practice version control and collaboration via GitHub  
- Deploy Node.js APIs to cloud platforms using free-tier services  

---

## 🎯 **Next Steps**

1. Finalize and validate the SQL initialization script.  
2. Implement API routes and connect with PostgreSQL.  
3. Test endpoints using Swagger UI and Postman.  
4. Deploy the working API to Render or Heroku.  
5. Submit the completed project for evaluation.  

---

# 🚀 **Beta Sprint**

## 🌐 Hosted Web API
**Live URL:** [https://tcss460-moviewebapi.onrender.com](https://tcss460-moviewebapi.onrender.com)  
Hosted on **Render**, auto-deploys on pushes to the `main` branch.

---

## 🧩 Beta Sprint Contribution

| **Team Member** | **Contribution** |
|------------------|------------------|
| **Ryder DeBack** | Redesigned the database for efficiency, merging multiple scripts into one SQL insert process. Updated ER diagram and optimized import speed from 13 hours to under 3 minutes. |
| **Kevin Nam Hoang** | Deployed and hosted the working API on Render. Implemented and verified the **`/moviesbyyear?year=YYYY`** route and ensured it queries from the external cloud-hosted database. |
| **Faisal Nur** | Developed the Postman collection to test all implemented routes (`/movies`, `/movies/:id`, `/moviesbyyear`, `/health`) and exported it to `/testing/postman/postman.json`. |
| **Mutahar Wafayee** | Completed the API documentation (`/api-docs`) for hosted deployment, added the `/moviesbyyear` route details in Swagger YAML, and updated this README file for the Beta Sprint submission. |

---

## 🗓️ Beta Sprint Meetings

- **Oct 14 – Initial Planning Meeting (Discord):**  
  Ryder and Kevin discussed new database design and division of responsibilities.  
  Tasks were assigned: Ryder (Database), Kevin (Hosting), Faisal (Testing), Mutahar (Documentation).
  
- **Oct 15–16 – Progress Updates (Discord):**  
  Discussed database import improvements, Render deployment status, and route testing plan.  
  Ryder confirmed DB optimization; Kevin confirmed `/moviesbyyear` worked on Render.

- **Oct 17 – Final Review (Discord & GitHub):**  
  Faisal completed testing and shared results; Mutahar finalized `/api-docs` and README updates.

**Primary Communication:** Discord text and file-sharing.  
**Secondary Tools:** GitHub commits, comments, and Render build logs.

---

## 💬 Beta Sprint Comments

- Import performance increased drastically after redesign (3 minutes vs. 13 hours).  
- Render free tier occasionally returns “502 Bad Gateway” after inactivity, which resolves after waking.  
- The `/moviesbyyear` route is fully implemented and tested, returning correct JSON data for year queries.  
- Postman test collection confirms all working endpoints.  
- Swagger `/api-docs` reflects accurate routes and marks unimplemented ones as “Not Implemented Yet.”  
- Future sprints will focus on completing relationship tables and CRUD routes for genres, studios, and people.

---

**Built with 🎬, ☁️, and 💻 by Group 4 – Movies Dataset Web API Team**  
