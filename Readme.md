# Week06 Exercise - Notes Application

Student ID: 101563789 — COMP3123

Restful CRUD API for a simple Note-Taking application using Node.js, Express and MongoDB (Atlas + Mongoose).

## Project Structure

```
server.js              # Express app + MongoDB connection
models/NotesModel.js   # Note schema
routes/NoteRoutes.js   # CRUD routes
Dockerfile             # Optional Docker hosting
```

## Steps to Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file (see `.env.example`)

```
DB_URL=mongodb+srv://<username>:<password>@<cluster-host>/notes_db?retryWrites=true&w=majority
PORT=8081
```

3. Run Server

```bash
npm start
```

4. Test all APIs in Postman at <http://localhost:8081/api/notes>

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST   | /api/notes         | Create a note (body: `{ "content": {...} }`) |
| GET    | /api/notes         | Get all notes |
| GET    | /api/notes/:noteId | Get one note |
| PUT    | /api/notes/:noteId | Update a note (body: `{ "content": {...} }`) |
| DELETE | /api/notes/:noteId | Delete a note |

## Sample Note Payload

```json
{
    "content" : {
        "noteTitle": "Sample Note Title",
        "noteDescription": "Sample Note Description",
        "priority": "HIGH",
        "dateAdded": "06/Oct/2025",
        "dateUpdated": "06/Oct/2025"
    }
}
```

## Errors Fixed in Starter Code

1. `NoteRoutes.js` required `../models/Notes.js` — file is `models/NotesModel.js`.
2. Note routes were never registered in `server.js` (`app.use(noteRoutes)` was missing).
3. GET and DELETE routes validated `req.body.content` — those requests have no body, so they always returned 400.
4. `findByIdAndRemove` no longer exists in Mongoose 8 — replaced with `findByIdAndDelete`.
5. Removed deprecated `useNewUrlParser` / `useUnifiedTopology` connect options.
6. Server log said port 3000 while the app listens on 8081.
7. Priority typo `MEDUIM` → `MEDIUM`; schema was never defined/exported.
8. DB URL moved to `.env` (dotenv) so credentials aren't committed.

## Docker (Optional)

```bash
docker build -t notes-app .
docker run -p 8081:8081 --env-file .env notes-app
```
