from app.util.utils import convert_data_type


class FormUtil:
    @staticmethod
    def form_data_to_json(fields):
        datas = {}
        for field in fields:
            datas[field] = fields[field]
        return datas

    @staticmethod
    def form_to_dict(form_data):
        datas = {}
        for key in form_data.keys():
            if key.endswith("[]"):
                clean_key = key[:-2]
                values = form_data.getlist(key)
                datas[clean_key] = [convert_data_type(value) for value in values]
                if len(datas[clean_key]) == 1 and datas[clean_key][0] == '[]':
                    datas[clean_key] = []
            else:
                datas[key] = convert_data_type(form_data.get(key))
        return datas