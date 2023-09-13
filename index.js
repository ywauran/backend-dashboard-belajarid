import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

mongoose.connect(
  "mongodb+srv://ywauran:Oj5eEieDzUmlfQPl@dashboard.cjetrwd.mongodb.net/dashboard?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Anda dapat langsung mengakses koleksi MongoDB tanpa skema
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

app.get("/api/slb/teacher", async (req, res) => {
  const { page = 1, limit = 5, center } = req.query;
  const skip = (page - 1) * limit;

  try {
    const collection = db.collection("slb");

    const data = await collection
      .find({ "Employee Title": "teacher", "Org Unit ID": center })
      .skip(skip)
      .sort({ "Last Sign In [READ ONLY]": -1 })
      .limit(parseInt(limit))
      .toArray();

    const allData = await collection
      .find({ "Employee Title": "teacher", "Org Unit ID": center }) // Filter data for "teacher" only
      .toArray();

    // Count the number of true and false values based on the "Last Sign In [READ ONLY]" condition
    let trueCount = 0;
    let falseCount = 0;
    allData.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
        falseCount++;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
        trueCount++;
      }
    });

    data.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
      }
    });

    // Create a JSON object containing the calculation results
    const result = {
      trueCount,
      falseCount,
      data,
    };
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/slb/student", async (req, res) => {
  const { page = 1, limit = 5, center } = req.query;
  const skip = (page - 1) * limit;

  try {
    const collection = db.collection("slb");

    const data = await collection
      .find({ "Employee Title": "student", "Org Unit ID": center })
      .sort({ "Last Sign In [READ ONLY]": -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const allData = await collection
      .find({ "Employee Title": "student", "Org Unit ID": center }) // Filter data for "teacher" only
      .toArray();

    // Count the number of true and false values based on the "Last Sign In [READ ONLY]" condition
    let trueCount = 0;
    let falseCount = 0;
    allData.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
        falseCount++;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
        trueCount++;
      }
    });

    data.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
      }
    });

    // Create a JSON object containing the calculation results
    const result = {
      trueCount,
      falseCount,
      data,
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/slb", async (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Mengambil nilai page dan limit dari query parameter
  const skip = (page - 1) * limit;

  try {
    const collection = db.collection("slb");

    // Agregasi untuk mengelompokkan data berdasarkan Org Unit ID dan memilih satu dokumen dari setiap kelompok
    const aggregationPipeline = [
      {
        $group: {
          _id: "$Org Unit ID",
          document: { $first: "$$ROOT" },
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $replaceRoot: { newRoot: "$document" },
      },
    ];

    const data = await collection.aggregate(aggregationPipeline).toArray();

    const allDataStudent = await collection
      .find({ "Employee Title": "student" })
      .toArray();
    // Menghitung jumlah nilai true dan false berdasarkan kondisi "Last Sign In [READ ONLY]"
    let trueCountStudent = 0;
    let falseCountStudent = 0;
    allDataStudent.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
        falseCountStudent++;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
        trueCountStudent++;
      }
    });

    const allDataTeacher = await collection
      .find({ "Employee Title": "teacher" })
      .toArray();
    // Menghitung jumlah nilai true dan false berdasarkan kondisi "Last Sign In [READ ONLY]"
    let trueCountTeacher = 0;
    let falseCountTeacher = 0;
    allDataTeacher.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
        falseCountTeacher++;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
        trueCountTeacher++;
      }
    });

    data.sort((a, b) => {
      if (b.trueCountStudent !== a.trueCountStudent) {
        return b.trueCountStudent - a.trueCountStudent;
      } else {
        return a["Org Unit ID"].localeCompare(b["Org Unit ID"]);
      }
    });

    const result = {
      data,
      trueCountStudent,
      falseCountStudent,
      trueCountTeacher,
      falseCountTeacher,
    };
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/smk/teacher", async (req, res) => {
  const { page = 1, limit = 5, center } = req.query;
  const skip = (page - 1) * limit;

  try {
    const collection = db.collection("smk");

    const data = await collection
      .find({ "Employee Title": "teacher", "Org Unit ID": center })
      .skip(skip)
      .sort({ "Last Sign In [READ ONLY]": -1 })
      .limit(parseInt(limit))
      .toArray();

    const allData = await collection
      .find({ "Employee Title": "teacher", "Org Unit ID": center }) // Filter data for "teacher" only
      .toArray();

    // Count the number of true and false values based on the "Last Sign In [READ ONLY]" condition
    let trueCount = 0;
    let falseCount = 0;
    allData.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
        falseCount++;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
        trueCount++;
      }
    });

    data.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
      }
    });

    // Create a JSON object containing the calculation results
    const result = {
      trueCount,
      falseCount,
      data,
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/smk/student", async (req, res) => {
  const { page = 1, limit = 5, center } = req.query;
  const skip = (page - 1) * limit;

  try {
    const collection = db.collection("smk");

    const data = await collection
      .find({ "Employee Title": "student", "Org Unit ID": center })
      .sort({ "Last Sign In [READ ONLY]": -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const allData = await collection
      .find({ "Employee Title": "student", "Org Unit ID": center }) // Filter data for "teacher" only
      .toArray();

    // Count the number of true and false values based on the "Last Sign In [READ ONLY]" condition
    let trueCount = 0;
    let falseCount = 0;
    allData.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
        falseCount++;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
        trueCount++;
      }
    });

    data.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
      }
    });

    // Create a JSON object containing the calculation results
    const result = {
      trueCount,
      falseCount,
      data,
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/smk", async (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Mengambil nilai page dan limit dari query parameter
  const skip = (page - 1) * limit;

  try {
    const collection = db.collection("smk");

    // Agregasi untuk mengelompokkan data berdasarkan Org Unit ID dan memilih satu dokumen dari setiap kelompok
    const aggregationPipeline = [
      {
        $group: {
          _id: "$Org Unit ID",
          document: { $first: "$$ROOT" },
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $replaceRoot: { newRoot: "$document" },
      },
    ];

    const data = await collection.aggregate(aggregationPipeline).toArray();

    const allDataStudent = await collection
      .find({ "Employee Title": "student" })
      .toArray();
    // Menghitung jumlah nilai true dan false berdasarkan kondisi "Last Sign In [READ ONLY]"
    let trueCountStudent = 0;
    let falseCountStudent = 0;
    allDataStudent.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
        falseCountStudent++;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
        trueCountStudent++;
      }
    });

    const allDataTeacher = await collection
      .find({ "Employee Title": "teacher" })
      .toArray();
    // Menghitung jumlah nilai true dan false berdasarkan kondisi "Last Sign In [READ ONLY]"
    let trueCountTeacher = 0;
    let falseCountTeacher = 0;
    allDataTeacher.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
        falseCountTeacher++;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
        trueCountTeacher++;
      }
    });

    data.sort((a, b) => {
      if (b.trueCountStudent !== a.trueCountStudent) {
        return b.trueCountStudent - a.trueCountStudent;
      } else {
        return a["Org Unit ID"].localeCompare(b["Org Unit ID"]);
      }
    });

    const result = {
      data,
      trueCountStudent,
      falseCountStudent,
      trueCountTeacher,
      falseCountTeacher,
    };
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/sma/teacher", async (req, res) => {
  const { page = 1, limit = 5, center } = req.query;
  const skip = (page - 1) * limit;

  try {
    const collection = db.collection("sma");

    const data = await collection
      .find({ "Employee Title": "teacher", "Org Unit ID": center })
      .skip(skip)
      .sort({ "Last Sign In [READ ONLY]": -1 })
      .limit(parseInt(limit))
      .toArray();

    const allData = await collection
      .find({ "Employee Title": "teacher", "Org Unit ID": center }) // Filter data for "teacher" only
      .toArray();

    // Count the number of true and false values based on the "Last Sign In [READ ONLY]" condition
    let trueCount = 0;
    let falseCount = 0;
    allData.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
        falseCount++;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
        trueCount++;
      }
    });

    data.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
      }
    });

    // Create a JSON object containing the calculation results
    const result = {
      trueCount,
      falseCount,
      data,
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/sma/student", async (req, res) => {
  const { page = 1, limit = 5, center } = req.query;
  const skip = (page - 1) * limit;

  try {
    const collection = db.collection("sma");

    const data = await collection
      .find({ "Employee Title": "student", "Org Unit ID": center })
      .sort({ "Last Sign In [READ ONLY]": -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    const allData = await collection
      .find({ "Employee Title": "student", "Org Unit ID": center }) // Filter data for "teacher" only
      .toArray();

    // Count the number of true and false values based on the "Last Sign In [READ ONLY]" condition
    let trueCount = 0;
    let falseCount = 0;
    allData.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
        falseCount++;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
        trueCount++;
      }
    });

    data.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
      }
    });

    // Create a JSON object containing the calculation results
    const result = {
      trueCount,
      falseCount,
      data,
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/sma", async (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Mengambil nilai page dan limit dari query parameter
  const skip = (page - 1) * limit;

  try {
    const collection = db.collection("sma");

    // Agregasi untuk mengelompokkan data berdasarkan Org Unit ID dan memilih satu dokumen dari setiap kelompok
    const aggregationPipeline = [
      {
        $group: {
          _id: "$Org Unit ID",
          document: { $first: "$$ROOT" },
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $replaceRoot: { newRoot: "$document" },
      },
    ];

    const data = await collection.aggregate(aggregationPipeline).toArray();

    const allDataStudent = await collection
      .find({ "Employee Title": "student" })
      .toArray();
    // Menghitung jumlah nilai true dan false berdasarkan kondisi "Last Sign In [READ ONLY]"
    let trueCountStudent = 0;
    let falseCountStudent = 0;
    allDataStudent.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
        falseCountStudent++;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
        trueCountStudent++;
      }
    });

    const allDataTeacher = await collection
      .find({ "Employee Title": "teacher" })
      .toArray();
    // Menghitung jumlah nilai true dan false berdasarkan kondisi "Last Sign In [READ ONLY]"
    let trueCountTeacher = 0;
    let falseCountTeacher = 0;
    allDataTeacher.forEach((item) => {
      if (item["Last Sign In [READ ONLY]"] === "Never logged in") {
        item["Last Sign In [READ ONLY]"] = false;
        falseCountTeacher++;
      } else {
        item["Last Sign In [READ ONLY]"] = true;
        trueCountTeacher++;
      }
    });

    data.sort((a, b) => {
      if (b.trueCountStudent !== a.trueCountStudent) {
        return b.trueCountStudent - a.trueCountStudent;
      } else {
        return a["Org Unit ID"].localeCompare(b["Org Unit ID"]);
      }
    });

    const result = {
      data,
      trueCountStudent,
      falseCountStudent,
      trueCountTeacher,
      falseCountTeacher,
    };
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Backend Dashboard Belajar ID</h1>");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
