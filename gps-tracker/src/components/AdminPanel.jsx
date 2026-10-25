import { useRef, useState } from 'react'
import { Alert, Badge, Button, Col, Form, InputGroup, Modal, Row, Spinner } from 'react-bootstrap'
import { PROOF_TYPES, newId, readFile, saveRecords } from '../records'

const EMPTY = { driverName: '', vehicleName: '', from: '', to: '', loadKg: '' }

function ProofView({ proof }) {
  if (proof.file.type === 'application/pdf') {
    return (
      <a className="btn btn-sm btn-outline-light" href={proof.file.data} download={proof.file.name}>
        <i className="bi bi-file-earmark-pdf me-1" /> {proof.type} (PDF)
      </a>
    )
  }
  return (
    <a href={proof.file.data} target="_blank" rel="noreferrer" className="proof-thumb" title={proof.type}>
      <img src={proof.file.data} alt={proof.type} />
      <span>{proof.type}</span>
    </a>
  )
}

export default function AdminPanel({ records, setRecords, onTrack }) {
  const [form, setForm] = useState(EMPTY)
  const [photo, setPhoto] = useState(null)
  const [proofs, setProofs] = useState([])
  const [proofType, setProofType] = useState(PROOF_TYPES[0])
  const [errors, setErrors] = useState({})
  const [fileError, setFileError] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)
  const [viewing, setViewing] = useState(null)
  const photoInput = useRef(null)
  const proofInput = useRef(null)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
    setNotice(null)
  }

  const pickPhoto = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setFileError('')
    if (!file.type.startsWith('image/')) return setFileError('Driver photo must be an image.')
    try {
      setPhoto(await readFile(file))
      setErrors((er) => ({ ...er, photo: undefined }))
    } catch (ex) {
      setFileError(ex.message)
    }
  }

  const addProof = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setFileError('')
    try {
      const stored = await readFile(file)
      setProofs((p) => [...p, { id: newId(), type: proofType, file: stored }])
      setErrors((er) => ({ ...er, proofs: undefined }))
    } catch (ex) {
      setFileError(ex.message)
    }
  }

  const validate = () => {
    const er = {}
    if (!form.driverName.trim()) er.driverName = 'Enter the driver name'
    if (!form.vehicleName.trim()) er.vehicleName = 'Enter the vehicle name'
    if (!form.from.trim()) er.from = 'Enter the starting location'
    const kg = Number(form.loadKg)
    if (!form.loadKg || !(kg > 0)) er.loadKg = 'Enter the load in kg (greater than 0)'
    if (!photo) er.photo = 'Upload the driver photo'
    if (!proofs.length) er.proofs = 'Upload at least one ID proof (licence, Aadhaar…)'
    return er
  }

  const submit = (e) => {
    e.preventDefault()
    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) return

    setBusy(true)
    const record = {
      id: newId(),
      createdAt: Date.now(),
      driverName: form.driverName.trim(),
      vehicleName: form.vehicleName.trim(),
      from: form.from.trim(),
      to: form.to.trim(),
      loadKg: Number(form.loadKg),
      photo,
      proofs,
    }
    const next = [record, ...records]
    if (!saveRecords(next)) {
      setBusy(false)
      return setNotice({ variant: 'danger', text: 'Browser storage is full. Delete an old record or upload smaller files.' })
    }
    setRecords(next)
    setForm(EMPTY)
    setPhoto(null)
    setProofs([])
    setBusy(false)
    setNotice({ variant: 'success', text: `Saved: ${record.driverName} · ${record.vehicleName} · ${record.loadKg} kg`, trackId: record.id })
  }

  const remove = (id) => {
    if (!window.confirm('Delete this record?')) return
    const next = records.filter((r) => r.id !== id)
    saveRecords(next)
    setRecords(next)
    setViewing(null)
  }

  const totalKg = records.reduce((s, r) => s + r.loadKg, 0)

  return (
    <div className="admin-wrap">
      <Row className="g-3">
        {/* ---------------- Form ---------------- */}
        <Col xl={5}>
          <div className="panel">
            <div className="panel-head">
              <h6 className="panel-title">
                <i className="bi bi-person-plus me-2" />
                Add driver &amp; load
              </h6>
            </div>
            <Form className="p-3" onSubmit={submit} noValidate>
              {notice && (
                <Alert variant={notice.variant} className="py-2 small" dismissible onClose={() => setNotice(null)}>
                  {notice.text}
                  {notice.trackId && (
                    <Button size="sm" variant="success" className="ms-2" type="button" onClick={() => onTrack(notice.trackId)}>
                      <i className="bi bi-crosshair me-1" /> Track this truck
                    </Button>
                  )}
                </Alert>
              )}

              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>Driver name</Form.Label>
                  <Form.Control className="dark-input" placeholder="e.g. Ramesh Kumar" value={form.driverName} onChange={set('driverName')} isInvalid={!!errors.driverName} />
                  <Form.Control.Feedback type="invalid">{errors.driverName}</Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Vehicle name</Form.Label>
                  <Form.Control className="dark-input" placeholder="e.g. Tata 407 · KA 01 AB 1234" value={form.vehicleName} onChange={set('vehicleName')} isInvalid={!!errors.vehicleName} />
                  <Form.Control.Feedback type="invalid">{errors.vehicleName}</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>From</Form.Label>
                  <Form.Control className="dark-input" placeholder="Starting location" value={form.from} onChange={set('from')} isInvalid={!!errors.from} />
                  <Form.Control.Feedback type="invalid">{errors.from}</Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>To (optional)</Form.Label>
                  <Form.Control className="dark-input" placeholder="Destination" value={form.to} onChange={set('to')} />
                </Col>

                <Col xs={12}>
                  <Form.Label>Truck load</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control type="number" min="1" step="any" className="dark-input" placeholder="e.g. 2500" value={form.loadKg} onChange={set('loadKg')} isInvalid={!!errors.loadKg} />
                    <InputGroup.Text className="dark-input">kg</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">{errors.loadKg}</Form.Control.Feedback>
                  </InputGroup>
                </Col>

                {/* Driver photo */}
                <Col xs={12}>
                  <Form.Label>Driver photo</Form.Label>
                  <div className={`upload-box ${errors.photo ? 'invalid' : ''}`}>
                    {photo ? (
                      <img src={photo.data} alt="Driver preview" className="photo-preview" />
                    ) : (
                      <div className="photo-preview empty">
                        <i className="bi bi-person-bounding-box" />
                      </div>
                    )}
                    <div className="flex-grow-1">
                      <div className="small text-secondary mb-2">{photo ? photo.name : 'JPG or PNG, face clearly visible'}</div>
                      <Button size="sm" variant="outline-light" type="button" onClick={() => photoInput.current.click()}>
                        <i className="bi bi-camera me-1" /> {photo ? 'Change photo' : 'Upload photo'}
                      </Button>
                      {photo && (
                        <Button size="sm" variant="link" className="text-danger" type="button" onClick={() => setPhoto(null)}>
                          Remove
                        </Button>
                      )}
                    </div>
                    <input ref={photoInput} type="file" accept="image/*" hidden onChange={pickPhoto} />
                  </div>
                  {errors.photo && <div className="text-danger small mt-1">{errors.photo}</div>}
                </Col>

                {/* ID proofs */}
                <Col xs={12}>
                  <Form.Label>ID proofs</Form.Label>
                  <InputGroup>
                    <Form.Select className="dark-input" value={proofType} onChange={(e) => setProofType(e.target.value)} aria-label="Proof type">
                      {PROOF_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </Form.Select>
                    <Button variant="primary" type="button" onClick={() => proofInput.current.click()}>
                      <i className="bi bi-upload me-1" /> Upload
                    </Button>
                  </InputGroup>
                  <input ref={proofInput} type="file" accept="image/*,application/pdf" hidden onChange={addProof} />
                  <div className="small text-secondary mt-1">Images or PDF (under 600 KB). Add one file per proof.</div>

                  {proofs.length > 0 && (
                    <ul className="proof-list">
                      {proofs.map((p) => (
                        <li key={p.id}>
                          <i className={`bi ${p.file.type === 'application/pdf' ? 'bi-file-earmark-pdf' : 'bi-file-earmark-image'}`} />
                          <span className="flex-grow-1 text-truncate">
                            <strong>{p.type}</strong> · {p.file.name}
                          </span>
                          <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => setProofs((l) => l.filter((x) => x.id !== p.id))} aria-label="Remove proof">
                            <i className="bi bi-x-lg" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {errors.proofs && <div className="text-danger small mt-1">{errors.proofs}</div>}
                </Col>

                {fileError && (
                  <Col xs={12}>
                    <div className="text-danger small">
                      <i className="bi bi-exclamation-circle me-1" />
                      {fileError}
                    </div>
                  </Col>
                )}

                <Col xs={12} className="d-grid">
                  <Button type="submit" size="lg" variant="primary" disabled={busy}>
                    {busy ? <Spinner size="sm" className="me-2" /> : <i className="bi bi-check2-circle me-2" />}
                    Save driver &amp; load
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>

        {/* ---------------- Records ---------------- */}
        <Col xl={7}>
          <div className="panel">
            <div className="panel-head">
              <h6 className="panel-title">
                <i className="bi bi-card-list me-2" />
                Driver records
              </h6>
              <div className="d-flex gap-2">
                <Badge bg="secondary">{records.length} drivers</Badge>
                <Badge bg="primary">{totalKg.toLocaleString()} kg total</Badge>
              </div>
            </div>

            {records.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-inbox" />
                No records yet. Fill the form and save to see them here.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark align-middle mb-0 rec-table">
                  <thead>
                    <tr>
                      <th>Driver</th>
                      <th>Vehicle</th>
                      <th>Route</th>
                      <th className="text-end">Load</th>
                      <th>Proofs</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img src={r.photo.data} alt="" className="rec-avatar" />
                            <div>
                              <div className="fw-semibold">{r.driverName}</div>
                              <small className="text-secondary">{new Date(r.createdAt).toLocaleDateString()}</small>
                            </div>
                          </div>
                        </td>
                        <td>{r.vehicleName}</td>
                        <td>
                          {r.from}
                          {r.to && (
                            <>
                              {' '}
                              <i className="bi bi-arrow-right-short" /> {r.to}
                            </>
                          )}
                        </td>
                        <td className="text-end fw-semibold">{r.loadKg.toLocaleString()} kg</td>
                        <td>
                          <Badge bg="success" className="fw-normal">
                            {r.proofs.length} file{r.proofs.length > 1 ? 's' : ''}
                          </Badge>
                        </td>
                        <td className="text-end text-nowrap">
                          <Button size="sm" variant="primary" onClick={() => onTrack(r.id)}>
                            <i className="bi bi-crosshair me-1" /> Track
                          </Button>{' '}
                          <Button size="sm" variant="outline-light" onClick={() => setViewing(r)}>
                            View
                          </Button>{' '}
                          <Button size="sm" variant="outline-danger" onClick={() => remove(r.id)} aria-label="Delete">
                            <i className="bi bi-trash" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* ---------------- Detail modal ---------------- */}
      <Modal show={!!viewing} onHide={() => setViewing(null)} centered data-bs-theme="dark">
        {viewing && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="fs-5">{viewing.driverName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex gap-3 mb-3">
                <img src={viewing.photo.data} alt={viewing.driverName} className="detail-photo" />
                <div className="flex-grow-1">
                  <div className="kv"><span>Vehicle</span><span>{viewing.vehicleName}</span></div>
                  <div className="kv"><span>From</span><span>{viewing.from}</span></div>
                  {viewing.to && <div className="kv"><span>To</span><span>{viewing.to}</span></div>}
                  <div className="kv"><span>Load</span><span>{viewing.loadKg.toLocaleString()} kg</span></div>
                  <div className="kv"><span>Added</span><span>{new Date(viewing.createdAt).toLocaleString()}</span></div>
                </div>
              </div>
              <h6 className="small text-secondary text-uppercase">ID proofs</h6>
              <div className="d-flex flex-wrap gap-2">
                {viewing.proofs.map((p) => (
                  <ProofView key={p.id} proof={p} />
                ))}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-danger" onClick={() => remove(viewing.id)}>
                <i className="bi bi-trash me-1" /> Delete
              </Button>
              <Button variant="secondary" onClick={() => setViewing(null)}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  )
}
