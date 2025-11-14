import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client
import os 

load_dotenv('../.env')  # load the .env on os.environ 

url= os.getenv('REACT_APP_SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if url is None or key is None:
    raise ValueError('The url os key value is None')

supabase:Client = create_client(url, key) # create the supabase pytohon client 
df = pd.read_csv("Arequipa.csv", delimiter = "," ,header = 0)   # read the csv 

for _, row in df.iterrows():  # df.iterrows give us (index, row)
    # Departament
    dept = supabase.table("departments").select("*").eq("name", row["DEPARTAMENTO"]).execute()  # Search for a specific department element on department table
    if not dept.data:   # if not exist (dept.data is empty) insert it
        dept_id = supabase.table("departments").insert({"name": row["DEPARTAMENTO"]}).execute().data[0]["department_id"] # .data[0]["department_id"] -> save the id department  
      # res.data looks like -> res.data == [{"department_id": 15, "name": "CUSCO"}]
    else:
        dept_id = dept.data[0]["department_id"]   # if exist store the value id to use in above functions

    # Province
    prov = supabase.table("provinces").select("*").eq("name", row["PROVINCIA"]).eq("department_id", dept_id).execute()
    if not prov.data:
        prov_id = supabase.table("provinces").insert({"name": row["PROVINCIA"], "department_id": dept_id}).execute().data[0]["province_id"]
    else:
        prov_id = prov.data[0]["province_id"]

    # District
    dist = supabase.table("districts").select("*").eq("name", row["DISTRITO"]).eq("province_id", prov_id).execute()
    if not dist.data:
        dist_id = supabase.table("districts").insert({"name": row["DISTRITO"], "province_id": prov_id}).execute().data[0]["district_id"]
    else:
        dist_id = dist.data[0]["district_id"]
      

    # Town
    supabase.table("towns").upsert({
        "name": row["CENTRO POBLADO"],
        "district_id": dist_id,
        "height": float(row["ALTITUD"]),
        "altitude_adjustment": float(str(row["AJUSTE DE HB"]).replace(",", "."))
    }, on_conflict="district_id,name").execute()

    print('Town added in district' + str(dist_id))


#---------------------------------------------------------
#      THE ELEMENTS ARE ADDED UP TO
#       - AMAZONAS - RODRIGUEZ
#       - AREQUIPA - AREQUIPA 
