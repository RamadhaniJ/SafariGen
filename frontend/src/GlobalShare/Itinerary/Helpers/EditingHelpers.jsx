
export default function normalizeDestinationInputHelper (id, name){
        if (!id) return null;
        if (typeof id === "object" && id !== null) return id;
        return {id, name: name || "" };
    }
 