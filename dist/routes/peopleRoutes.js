import express from 'express';
import { getAllPeople, getPersonById, createPerson, updatePerson, deletePerson } from '../controllers/peopleController.js';
const router = express.Router();
// GET /people - List all people
router.get('/', getAllPeople);
// GET /people/:person_id - Get person by ID
router.get('/:person_id', getPersonById);
// POST /people - Create a new person
router.post('/', createPerson);
// PUT /people/:person_id - Update a person
router.put('/:person_id', updatePerson);
// DELETE /people/:person_id - Delete a person
router.delete('/:person_id', deletePerson);
export default router;
//# sourceMappingURL=peopleRoutes.js.map