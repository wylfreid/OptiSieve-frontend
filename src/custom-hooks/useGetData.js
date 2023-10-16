import { useState, useEffect } from "react";
import { db } from "../firebase.config";
import { collection, onSnapshot } from "firebase/firestore";

const useGetData = (collectionName) => {
  const [data, setData] = useState([]);
  const collectionRef = collection(db, collectionName);

  const [loading, seLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      // ====== firebase realtime data update ==========

      await onSnapshot(collectionRef, (snapshot) => {
        setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        seLoading(false);
      });
    };

    getData();
  }, []);

  return { data, loading };
};

export default useGetData;
