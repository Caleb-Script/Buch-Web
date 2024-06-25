import "./styles.css";
import dotenv from "dotenv";

dotenv.config();

let BUECHER_PRO_SEITE: number;
if (process.env.BUECHER_PRO_SEITE) {
  BUECHER_PRO_SEITE = parseInt(process.env.BUECHER_PRO_SEITE);
}

export async function BuchTabelleSkelet() {
  return (
    <main>
      <table className="table  table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col">Titel</th>
            <th scope="col">Isbn</th>
            <th scope="col">Art</th>
            <th scope="col">Preis</th>
            <th scope="col">Schlagwörter</th>
            <th scope="col">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: BUECHER_PRO_SEITE }).map((_, index) => (
            <TableRowSkelet key={index} />
          ))}
        </tbody>
      </table>
    </main>
  );
}

export async function TableRowSkelet() {
  return (
    <tr>
      {/* ID */}
      <th style={{ width: "26.5rem" }}>
        <div
          className="d-flex align-item-center justify-content-center py-3 w-100"
          style={{ width: "18rem" }}
        >
          <div
            className="shimmering-box bg-secondary py-1 w-100 rounded"
            style={{ width: "18rem" }}
          >
            <div className="shimmer"></div>
          </div>
        </div>
      </th>

      {/* Name */}
      <th>
        <div
          className="d-flex align-item-center justify-content-center py-3 w-100"
          style={{ width: "3rem" }}
        >
          <div
            className="shimmering-box bg-secondary py-1 w-100 rounded"
            style={{ width: "3rem" }}
          >
            <div className="shimmer"></div>
          </div>
        </div>
      </th>

      {/* Vorname */}
      <th>
        <div
          className="d-flex align-item-center justify-content-center py-3 w-100"
          style={{ width: "3.2rem" }}
        >
          <div
            className="shimmering-box bg-secondary py-1 w-100 rounded"
            style={{ width: "3.2rem" }}
          >
            <div className="shimmer"></div>
          </div>
        </div>
      </th>

      {/* Geschlecht */}
      <th>
        <div
          className="d-flex align-item-center justify-content-center py-2 w-100"
          style={{ width: "1rem", height: "2rem" }}
        >
          <div
            className="shimmering-box bg-secondary w-100 rounded"
            style={{ width: "1.25rem" }}
          >
            <div className="shimmer"></div>
          </div>
        </div>
      </th>

      {/* Kontakt */}
      <th>
        <div
          className="d-flex align-item-center justify-content-center gap-1 w-100"
          style={{ width: "14.1rem", height: "2rem" }}
        >
          <div
            className="shimmering-box bg-secondary w-100 rounded"
            style={{ width: "14.1rem" }}
          >
            <div className="shimmer"></div>
          </div>
          <div
            className="shimmering-box bg-secondary w-100 rounded"
            style={{ width: "14.1rem" }}
          >
            <div className="shimmer"></div>
          </div>
          <div
            className="shimmering-box bg-secondary w-100 rounded"
            style={{ width: "14.1rem" }}
          >
            <div className="shimmer"></div>
          </div>
          <div
            className="shimmering-box bg-secondary w-100 rounded"
            style={{ width: "14.1rem" }}
          >
            <div className="shimmer"></div>
          </div>
        </div>
      </th>

      {/* Aktionen */}
      <th>
        <div
          className="d-flex align-item-center justify-content-center gap-3  w-100"
          style={{ width: "10rem", height: "2rem" }}
        >
          <div
            className="shimmering-box bg-secondary h-100  w-100 rounded"
            style={{ width: "6.25rem" }}
          >
            <div className="shimmer"></div>
          </div>
          <div
            className="shimmering-box bg-secondary h-100 w-100 rounded"
            style={{ width: "6.25rem" }}
          >
            <div className="shimmer"></div>
          </div>
          <div
            className="shimmering-box bg-secondary h-100 w-100 rounded"
            style={{ width: "6.25rem" }}
          >
            <div className="shimmer"></div>
          </div>
        </div>
      </th>
    </tr>
  );
}
