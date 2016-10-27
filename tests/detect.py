import os
import ast
from StringIO import StringIO

def detect(self, file,content_type='multipart/form-data'):
    """Test face detection.
    Mocks image recieved by detect method in facelook.
    Image is mocked as proper type: "multipart/form-data"

    Note:
        File must be located inside tests/test_images folder.

    Args:
        file: File that will be recieved by detect method from facelook.

    Attributes:
        rel_path (str): Specifies in which folder relative to script location file should be found

    Returns:
        Responce from detect in facelook

    """
    rel_path = "test_images/"
    abs_file_path = os.path.join(os.path.dirname(__file__), rel_path, file)
    with open(abs_file_path) as test:
        imgStringIO = StringIO(test.read())
    return self.app.post('/api/detect', content_type=content_type, data=dict(
        {'file': (imgStringIO, file)}
    ))

def detect_folder(self, folder_path):
    """Mass test face detection.
    Finds all files in the specified folder and uses detect method to mock them.
    Prints message with each file that wasn't recognized properly stating how many faces was recognized.
    Prints percentage of the properly detected images.

    Note:
        Faces on the image considered to be recognized properly if there is exactly one face recognized on the image.
        Folder must be located inside tests/test_images folder
        May take considerable amount of time depending on size of the images and their amount

    Args:
        folder_path: Path to the folder with files that will be sent to detect method.

    Attributes:
        num (float): Number of properly recognized images
        total_num (float): Total number of images
        percent (int): Percent of properly recognized images
        face_num (int): Number of recognized faces on the image
        fn(str): Name of the file currently processed

    Returns:
        True if all images are recognized properly, False otherwise.

    """
    num = 0.0
    total_num = 0.0
    for fn in os.listdir(folder_path):
        fn_with_path = folder_path + '/' + fn
        rv = detect(self, fn_with_path)
        rv_as_list = ast.literal_eval(rv.data)
        total_num += 1
        face_num = len(rv_as_list)
        if face_num != 1:
            print('Found ' + str(face_num) + ' faces on the image instead of one: ' + fn)
            num += 1
    percent = int((1 - num / total_num) * 100)
    print (str(percent) + "% of the faces detected properly")
    if num > 0:
        return False
    else:
        return True
